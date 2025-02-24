import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

  /**
   * Checks location permission status.
   * @returns Promise<boolean> - true if permission is granted, false otherwise.
   */
  async checkPermission(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();
      return status.location === 'granted';
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Requests location permission from the user.
   * @returns Promise<boolean> - true if permission is granted, false otherwise.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Gets the user's current location.
   * If permission is not granted, it will request permission first.
   * @returns Promise<{ latitude: number; longitude: number } | null>
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      let hasPermission = await this.checkPermission();
      
      // If no permission, request it
      if (!hasPermission) {
        hasPermission = await this.requestPermission();
      }

      if (!hasPermission) {
        console.warn('Location permission denied');
        return null;
      }

      // Get current position
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }
}
