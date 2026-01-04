import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('check', () => {
    it('should return status ok with timestamp and environment', () => {
      const mockDate = new Date('2025-08-10T12:00:00.000Z')
      jest.useFakeTimers().setSystemTime(mockDate)

      process.env.NODE_ENV = 'test'

      const result = controller.check()

      expect(result).toHaveProperty('status', 'ok')
      expect(result).toHaveProperty('timestamp', mockDate.toISOString())
      expect(result).toHaveProperty('environment', 'test')

      jest.useRealTimers()
    })

    it('should default environment to development if NODE_ENV not set', () => {
      const mockDate = new Date('2025-08-10T12:00:00.000Z')
      jest.useFakeTimers().setSystemTime(mockDate)

      delete process.env.NODE_ENV

      const result = controller.check()

      expect(result.environment).toBe('development')

      jest.useRealTimers()
    })
  })
})
