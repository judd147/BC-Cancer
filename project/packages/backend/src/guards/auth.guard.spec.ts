import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return false if there is no session in the request', () => {
        const context = {
          switchToHttp: () => ({
            getRequest: jest.fn().mockImplementation(() => ({})),
          }),
        };
  
        expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(
          false,
        );
    });


    it('should return false if there is no userId in the session', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: jest.fn().mockImplementation(() => ({ session: {} })),
        }),
      };

      expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(
        false,
      );
    });

    it('should return true if there is a userId in the session', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: jest
            .fn()
            .mockImplementation(() => ({ session: { userId: '123' } })),
        }),
      };

      expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(
        true,
      );
    });
  });
});
