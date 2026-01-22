export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    error?: any;
}

class Logger {
    private log(level: LogLevel, message: string, context?: Record<string, any>, error?: any) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };

        if (error) {
            entry.error =
                error instanceof Error
                    ? {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                    }
                    : error;
        }

        // Standard console logging for Vercel/Node environment
        if (level === 'error') {
            console.error(JSON.stringify(entry));
        } else if (level === 'warn') {
            console.warn(JSON.stringify(entry));
        } else {
            console.log(JSON.stringify(entry));
        }
    }

    info(message: string, context?: Record<string, any>) {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, any>, error?: any) {
        this.log('warn', message, context, error);
    }

    error(message: string, error?: any, context?: Record<string, any>) {
        this.log('error', message, context, error);
    }

    debug(message: string, context?: Record<string, any>) {
        // Check NODE_ENV for debug logging
        if (process.env.NODE_ENV !== 'production') {
            this.log('debug', message, context);
        }
    }
}

export const logger = new Logger();
