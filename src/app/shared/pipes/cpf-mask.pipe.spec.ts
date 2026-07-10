import { CpfMaskPipe } from './cpf-mask.pipe';

describe('CpfMaskPipe', () => {
  const pipe = new CpfMaskPipe();

  it('should mask a valid CPF', () => {
    expect(pipe.transform('12345678901')).toBe('123.456.789-01');
  });

  it('should return only digits when CPF is incomplete', () => {
    expect(pipe.transform('123.456')).toBe('123456');
  });
});
