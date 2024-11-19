import { Scene } from 'phaser';

export class LoginScreen extends Scene {
  constructor() {
    super('login-screen');
  }
  init(): void {
    this.registry.set('scene', 'login-screen');
  }
  create(): void {

  }
}