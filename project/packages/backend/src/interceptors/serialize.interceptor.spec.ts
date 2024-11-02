import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { Serialize, SerializeInterceptor } from './serialize.interceptor';
const plainToInstanceMock = jest.fn();

jest.mock('class-transformer', () => ({
    plainToInstance: jest.fn().mockImplementation(() => plainToInstanceMock()),
    }));

class TestDto {
  prop: string;
}

describe('SerializeInterceptor', () => {
  let interceptor: SerializeInterceptor;

  beforeEach(() => {
    interceptor = new SerializeInterceptor(TestDto);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform data using plainToInstance', (done) => {
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of({ prop: 'value' }),
    };

    plainToInstanceMock.mockReturnValue({ prop: 'value' });

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ prop: 'value' });
      done();
    });
  });

  it('should exclude extraneous values', (done) => {
    const context: ExecutionContext = {} as any;
    const next: CallHandler = {
      handle: () => of({ prop: 'value', extra: 'extra' }),
    };

    plainToInstanceMock.mockReturnValue({ prop: 'value' });

    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({ prop: 'value' });
      done();
    });
  });
});

describe('Serialize', () => {
  it('should return a UseInterceptors decorator', () => {
    const decorator = Serialize(TestDto);
    expect(decorator).toBeDefined();
  });
});