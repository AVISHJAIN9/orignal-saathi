import { Injectable } from '@nestjs/common';
import { WhatsAppSessionState } from './whatsapp.types';

@Injectable()
export class WhatsAppSessionManager {
  private readonly sessions: Map<string, WhatsAppSessionState> = new Map();
  private readonly sessionWindowMs = 24 * 60 * 60 * 1000;

  public sanitizePhoneNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  public getOrCreateSession(
    rawPhone: string,
    userName?: string,
    language: 'en' | 'hi' = 'en'
  ): WhatsAppSessionState {
    const phoneNumber = this.sanitizePhoneNumber(rawPhone);
    const existing = this.sessions.get(phoneNumber);
    const now = Date.now();

    if (existing) {
      existing.lastMessageTimestamp = now;
      if (userName && !existing.userName) {
        existing.userName = userName;
      }
      this.sessions.set(phoneNumber, existing);
      return existing;
    }

    const conversationId = `CONV-WA-${phoneNumber}-${now}`;
    const newSession: WhatsAppSessionState = {
      phoneNumber,
      conversationId,
      userName: userName || 'WhatsApp MSME User',
      language,
      optInStatus: true,
      optInDate: new Date().toISOString(),
      lastMessageTimestamp: now,
    };

    this.sessions.set(phoneNumber, newSession);
    return newSession;
  }

  public isSessionActive(rawPhone: string): boolean {
    const phoneNumber = this.sanitizePhoneNumber(rawPhone);
    const session = this.sessions.get(phoneNumber);
    if (!session) return false;
    return Date.now() - session.lastMessageTimestamp < this.sessionWindowMs;
  }

  public handleOptInOut(rawPhone: string, keyword: string): { statusChanged: boolean; newOptInStatus: boolean } {
    const phoneNumber = this.sanitizePhoneNumber(rawPhone);
    const session = this.getOrCreateSession(phoneNumber);
    const cleanWord = keyword.trim().toUpperCase();

    if (cleanWord === 'STOP' || cleanWord === 'UNSUBSCRIBE' || cleanWord === 'OPT-OUT') {
      session.optInStatus = false;
      this.sessions.set(phoneNumber, session);
      return { statusChanged: true, newOptInStatus: false };
    }

    if (cleanWord === 'START' || cleanWord === 'SUBSCRIBE' || cleanWord === 'UNSTOP') {
      session.optInStatus = true;
      this.sessions.set(phoneNumber, session);
      return { statusChanged: true, newOptInStatus: true };
    }

    return { statusChanged: false, newOptInStatus: session.optInStatus };
  }

  public updateIntent(
    rawPhone: string,
    intent: WhatsAppSessionState['activeIntent'],
    currentStandard?: string
  ): void {
    const phoneNumber = this.sanitizePhoneNumber(rawPhone);
    const session = this.sessions.get(phoneNumber);
    if (session) {
      session.activeIntent = intent;
      if (currentStandard) {
        session.currentStandard = currentStandard;
      }
      this.sessions.set(phoneNumber, session);
    }
  }

  public setLanguage(rawPhone: string, lang: 'en' | 'hi'): void {
    const phoneNumber = this.sanitizePhoneNumber(rawPhone);
    const session = this.sessions.get(phoneNumber);
    if (session) {
      session.language = lang;
      this.sessions.set(phoneNumber, session);
    }
  }

  public getSession(rawPhone: string): WhatsAppSessionState | null {
    return this.sessions.get(this.sanitizePhoneNumber(rawPhone)) || null;
  }
}
