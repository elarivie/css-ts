import chalk from "chalk";

function doLog(logger: (msg: string) => string, prefix?: string, msg?: string, suffix?: string): void {
	prefix && process.stdout.write(prefix);
	msg && process.stdout.write(logger("" + msg));
	suffix && process.stdout.write(suffix);
	console.log();
}

export interface Logger{
	error: (msg?: string, prefix?: string, suffix?: string) => void;
	warn: (msg?: string, prefix?: string, suffix?: string) => void;
	info: (msg?: string, prefix?: string, suffix?: string) => void;
	debug: (msg?: string, prefix?: string, suffix?: string) => void;
	trace: (msg?: string, prefix?: string, suffix?: string) => void;
}

export function logger(verbose_level: number): Logger{
	return {
		error: (msg?: string, prefix?: string, suffix?: string) => { verbose_level >= 0 && doLog(chalk.red, prefix, '[Error] ' + msg, suffix); },
		warn: (msg?: string, prefix?: string, suffix?: string) => { verbose_level >= 1 && doLog((x: string) =>chalk.yellow(x), prefix, msg, suffix); },
		info: (msg?: string, prefix?: string, suffix?: string) => { verbose_level >= 2 && doLog((x: string) =>chalk.blue(x), prefix, msg, suffix); },
		debug: (msg?: string, prefix?: string, suffix?: string) => { verbose_level >= 3 && doLog((x: string) =>chalk.green(x), prefix, msg, suffix); },
		trace: (msg?: string, prefix?: string, suffix?: string) => { verbose_level >= 4 && doLog((x: string) =>chalk.gray(x), prefix, msg, suffix); }
	};
}

export default Logger;
