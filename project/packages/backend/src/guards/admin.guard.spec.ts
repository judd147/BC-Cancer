import { AdminGuard } from './admin.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return false if there is no currentUser', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: jest.fn().mockImplementation(() => ({ currentUser: null })),
        }),
      };

      expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(false);
    });

    it('should return false if currentUser is not an admin', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: jest.fn().mockImplementation(() => ({ currentUser: { admin: false } })),
        }),
      };

      expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(false);
    });

    it('should return true if currentUser is an admin', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: jest.fn().mockImplementation(() => ({ currentUser: { admin: true } })),
        }),
      };

      expect(guard.canActivate(context as unknown as ExecutionContext)).toBe(true);
    });
  });
});