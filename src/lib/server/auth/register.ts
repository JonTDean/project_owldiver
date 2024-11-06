import { getDb } from '../db';
import { sessions, users, refresh_tokens } from '../db/schema/auth';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { generateUUID } from '$lib/utils';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  session: {
    id: string;
    expires_at: Date;
  };
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const db = getDb();
  
  try {
    return await db.transaction(async (tx) => {
      console.log('🔄 Starting registration transaction...');
      
      // Check if user exists
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.email, data.email)
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      console.log('🔒 Hashing password...');
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      console.log('👤 Creating user...');
      const [newUser] = await tx.insert(users)
        .values({
          username: data.username,
          email: data.email,
          password_hash: hashedPassword,
          role: 'user',
        })
        .returning();

      console.log('✅ User created:', newUser);

      if (!newUser?.id) {
        throw new Error('Failed to create user');
      }

      // Create session within the transaction
      console.log('🔑 Creating session...');
      const accessToken = generateUUID();
      const refreshToken = generateUUID();
      
      const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Create session
      const [session] = await tx.insert(sessions)
        .values({
          id: accessToken,
          user_id: newUser.id,
          expires_at: accessTokenExpiry
        })
        .returning();

      // Create refresh token
      await tx.insert(refresh_tokens)
        .values({
          token: refreshToken,
          user_id: newUser.id,
          expires_at: refreshTokenExpiry
        });

      if (!session) {
        throw new Error('Failed to create session');
      }

      const response = {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        session: {
          id: session.id,
          expires_at: session.expires_at
        }
      };

      console.log('✅ Registration complete with response:', response);
      return response;
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
} 