// api-gateway/src/common/circuit-breaker.service.ts
import { Injectable } from '@nestjs/common';
import * as CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private breakers = new Map<string, any>();

  getBreaker(
    serviceKey: string,
    options: CircuitBreaker.Options = {},
  ): CircuitBreaker {
    if (!this.breakers.has(serviceKey)) {
      const defaultOptions: CircuitBreaker.Options = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
        resetTimeout: 30000, // After 30 seconds, try again
        ...options,
      };

      // Create a dummy function that will be replaced when the breaker is used
      const dummyFunction = async () => null;
      const breaker = new CircuitBreaker(dummyFunction, defaultOptions);

      // Add listeners for events
      breaker.on('open', () => {
        console.log(`Circuit Breaker for ${serviceKey} is open`);
      });

      breaker.on('close', () => {
        console.log(`Circuit Breaker for ${serviceKey} is closed`);
      });

      breaker.on('halfOpen', () => {
        console.log(`Circuit Breaker for ${serviceKey} is half open`);
      });

      this.breakers.set(serviceKey, breaker);
    }

    return this.breakers.get(serviceKey);
  }

  async execute<T>(
    serviceKey: string,
    fn: () => Promise<T>,
    fallback?: () => Promise<T>,
  ): Promise<T> {
    const breaker = this.getBreaker(serviceKey);

    // Replace the dummy function with the actual function
    breaker.fn = fn;

    if (fallback) {
      return breaker.fire().catch(fallback);
    }

    return breaker.fire();
  }
}
