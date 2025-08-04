import { useRef, useCallback, useState } from 'react';

export interface FacialMetrics {
  brightness: number;
  contrast: number;
  symmetry: number;
  expressionIntensity: number;
  emotionalValence: number; // -1 to 1, negative = sad, positive = happy
}

export class FacialAnalyzer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }

  analyzeFacialMetrics(video: HTMLVideoElement): FacialMetrics {
    try {
      // Set canvas size to video size
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      this.context.drawImage(video, 0, 0);
      
      // Get image data
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
      
      // Calculate brightness (average luminance)
      let totalBrightness = 0;
      let pixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Calculate luminance using standard formula
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        totalBrightness += brightness;
        pixels++;
      }
      
      const avgBrightness = totalBrightness / pixels;
      
      // Calculate contrast (standard deviation of brightness)
      let contrastSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        contrastSum += Math.pow(brightness - avgBrightness, 2);
      }
      
      const contrast = Math.sqrt(contrastSum / pixels);
      
      // Simple symmetry approximation (compare left vs right halves)
      const leftHalf = this.context.getImageData(0, 0, this.canvas.width / 2, this.canvas.height);
      const rightHalf = this.context.getImageData(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);
      
      let symmetryDiff = 0;
      for (let i = 0; i < leftHalf.data.length; i += 4) {
        const leftBrightness = (0.299 * leftHalf.data[i] + 0.587 * leftHalf.data[i + 1] + 0.114 * leftHalf.data[i + 2]) / 255;
        const rightBrightness = (0.299 * rightHalf.data[i] + 0.587 * rightHalf.data[i + 1] + 0.114 * rightHalf.data[i + 2]) / 255;
        symmetryDiff += Math.abs(leftBrightness - rightBrightness);
      }
      
      const symmetry = 1 - (symmetryDiff / (leftHalf.data.length / 4));
      
      // Expression intensity (based on contrast in lower face area)
      const lowerFaceY = Math.floor(this.canvas.height * 0.6);
      const lowerFaceData = this.context.getImageData(0, lowerFaceY, this.canvas.width, this.canvas.height - lowerFaceY);
      
      let lowerFaceContrast = 0;
      let lowerFaceBrightness = 0;
      const lowerFacePixels = lowerFaceData.data.length / 4;
      
      for (let i = 0; i < lowerFaceData.data.length; i += 4) {
        const brightness = (0.299 * lowerFaceData.data[i] + 0.587 * lowerFaceData.data[i + 1] + 0.114 * lowerFaceData.data[i + 2]) / 255;
        lowerFaceBrightness += brightness;
      }
      lowerFaceBrightness /= lowerFacePixels;
      
      for (let i = 0; i < lowerFaceData.data.length; i += 4) {
        const brightness = (0.299 * lowerFaceData.data[i] + 0.587 * lowerFaceData.data[i + 1] + 0.114 * lowerFaceData.data[i + 2]) / 255;
        lowerFaceContrast += Math.pow(brightness - lowerFaceBrightness, 2);
      }
      lowerFaceContrast = Math.sqrt(lowerFaceContrast / lowerFacePixels);
      
      const expressionIntensity = lowerFaceContrast * 2; // Scale for better range
      
      // Emotional valence approximation (based on overall brightness patterns)
      // Brighter faces tend to correlate with positive emotions
      const emotionalValence = (avgBrightness - 0.5) * 2; // Map to -1 to 1 range
      
      return {
        brightness: Math.min(1, Math.max(0, avgBrightness)),
        contrast: Math.min(1, Math.max(0, contrast * 4)), // Scale for better range
        symmetry: Math.min(1, Math.max(0, symmetry)),
        expressionIntensity: Math.min(1, Math.max(0, expressionIntensity)),
        emotionalValence: Math.min(1, Math.max(-1, emotionalValence))
      };
    } catch (error) {
      console.error('Error analyzing facial metrics:', error);
      return {
        brightness: 0.5,
        contrast: 0.5,
        symmetry: 0.5,
        expressionIntensity: 0.5,
        emotionalValence: 0
      };
    }
  }

  captureFrame(video: HTMLVideoElement): string {
    try {
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
      this.context.drawImage(video, 0, 0);
      return this.canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing frame:', error);
      return '';
    }
  }
}

export const useCameraCapture = () => {
  const [isSupported, setIsSupported] = useState(true);
  const facialAnalyzerRef = useRef<FacialAnalyzer | null>(null);

  const initializeAnalyzer = useCallback(() => {
    if (!facialAnalyzerRef.current) {
      facialAnalyzerRef.current = new FacialAnalyzer();
    }
    return facialAnalyzerRef.current;
  }, []);

  const checkCameraSupport = useCallback(async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      setIsSupported(hasCamera);
      return hasCamera;
    } catch (error) {
      console.error('Error checking camera support:', error);
      setIsSupported(false);
      return false;
    }
  }, []);

  const startCamera = useCallback(async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Front camera for selfies
        }
      });
      return stream;
    } catch (error) {
      console.error('Error starting camera:', error);
      throw new Error('Unable to access camera. Please check permissions.');
    }
  }, []);

  const analyzeFacialMetrics = useCallback((video: HTMLVideoElement): FacialMetrics => {
    const analyzer = initializeAnalyzer();
    return analyzer.analyzeFacialMetrics(video);
  }, [initializeAnalyzer]);

  const captureFrame = useCallback((video: HTMLVideoElement): string => {
    const analyzer = initializeAnalyzer();
    return analyzer.captureFrame(video);
  }, [initializeAnalyzer]);

  return {
    isSupported,
    checkCameraSupport,
    startCamera,
    analyzeFacialMetrics,
    captureFrame
  };
};