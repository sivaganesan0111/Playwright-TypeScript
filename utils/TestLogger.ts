import { test, TestInfo } from '@playwright/test';

type StepResult = {
  name: string;
  expected: string;
  actual: string;
  status: 'passed' | 'failed';
};

export class TestLogger {
  private readonly startedAt = new Date();
  private readonly stepResults: StepResult[] = [];

  constructor(private readonly testInfo: TestInfo) {}

  info(message: string): void {
    console.info(`[${new Date().toISOString()}] [INFO] ${message}`);
  }

  error(message: string): void {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`);
  }

  async step(
    name: string,
    expected: string,
    action: () => Promise<string>
  ): Promise<void> {
    await test.step(name, async () => {
      const result: StepResult = {
        name,
        expected,
        actual: 'Step did not complete.',
        status: 'failed'
      };
      this.stepResults.push(result);

      try {
        result.actual = await action();
        result.status = 'passed';
        this.info(
          `[PASS] ${name}\nExpected: ${expected}\nActual: ${result.actual}`
        );
      } catch (error) {
        result.actual = `Exception: ${
          error instanceof Error ? error.message : String(error)
        }`;
        this.error(
          `[FAIL] ${name}\nExpected: ${expected}\n${result.actual}`
        );
        throw error;
      }
    });
  }

  async attachExecutionSummary(): Promise<void> {
    const endedAt = new Date();
    const errors = this.testInfo.errors
      .map((error) => `${error.message}\n${error.stack ?? ''}`)
      .join('\n\n');
    const steps = this.stepResults
      .map(
        (step, index) =>
          `${index + 1}. ${step.status.toUpperCase()} - ${step.name}\n` +
          `   Expected: ${step.expected}\n   Actual: ${step.actual}`
      )
      .join('\n\n');

    await this.testInfo.attach('execution-summary.txt', {
      body: [
        `Test case: ${this.testInfo.title}`,
        `Execution start: ${this.startedAt.toISOString()}`,
        `Execution end: ${endedAt.toISOString()}`,
        `Duration: ${this.testInfo.duration} ms`,
        `Status: ${this.testInfo.status ?? 'unknown'}`,
        errors ? `Execution errors:\n${errors}` : 'Execution errors: none',
        '',
        'Test steps:',
        steps || 'No steps were executed.'
      ].join('\n'),
      contentType: 'text/plain'
    });
  }
}
