import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async getToken(): Promise<string | null> {
    return await this.auth.currentUser?.getIdToken() ?? null;
  }
}