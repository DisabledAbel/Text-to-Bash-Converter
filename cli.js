#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const program = new Command();

// Format converters
const formatters = {
  bash: (text) => `\`\`\`bash\n${text}\n\`\`\``,
  typescript: (text) => `\`\`\`typescript\n${text}\n\`\`\``,
  javascript: (text) => `\`\`\`javascript\n${text}\n\`\`\``,
  python: (text) => `\`\`\`python\n${text}\n\`\`\``,
  markdown: (text) => `\`\`\`markdown\n${text}\n\`\`\``,
};

// Copy to clipboard helper
async function copyToClipboard(text) {
  try {
    const platform = process.platform;
    if (platform === 'darwin') {
      await execAsync(`echo "${text.replace(/"/g, '\\"')}" | pbcopy`);
    } else if (platform === 'linux') {
      await execAsync(`echo "${text.replace(/"/g, '\\"')}" | xclip -selection clipboard`);
    } else if (platform === 'win32') {
      await execAsync(`echo ${text} | clip`);
    } else {
      throw new Error('Unsupported platform for clipboard operations');
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Main conversion logic
function convertText(input, format) {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    console.error(chalk.red('Error: Input is empty'));
    process.exit(1);
  }

  const formatter = formatters[format];
  if (!formatter) {
    console.error(chalk.red(`Error: Unsupported format "${format}"`));
    console.log(chalk.yellow('Supported formats:'), Object.keys(formatters).join(', '));
    process.exit(1);
  }

  return formatter(trimmedInput);
}

// CLI configuration
program
  .name('tech2bash')
  .description('Convert code snippets to formatted markdown code blocks')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'Input file path')
  .option('-o, --output-format <format>', 'Output format (bash, typescript, javascript, python, markdown)', 'bash')
  .option('-c, --clipboard', 'Copy result to clipboard')
  .option('-s, --save <path>', 'Save result to file')
  .option('-q, --quiet', 'Suppress output to console')
  .action(async (options) => {
    let input = '';

    // Read from file or stdin
    if (options.file) {
      try {
        input = readFileSync(options.file, 'utf-8');
      } catch (error) {
        console.error(chalk.red(`Error reading file: ${error.message}`));
        process.exit(1);
      }
    } else {
      // Read from stdin
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      input = Buffer.concat(chunks).toString('utf-8');
    }

    // Convert the text
    const result = convertText(input, options.outputFormat);

    // Output to console (unless quiet)
    if (!options.quiet) {
      console.log(chalk.green('\n✓ Conversion successful!\n'));
      console.log(chalk.dim('─'.repeat(50)));
      console.log(result);
      console.log(chalk.dim('─'.repeat(50)));
    }

    // Copy to clipboard
    if (options.clipboard) {
      const success = await copyToClipboard(result);
      if (success) {
        console.log(chalk.green('\n✓ Copied to clipboard!'));
      } else {
        console.log(chalk.yellow('\n⚠ Could not copy to clipboard (may need xclip/pbcopy installed)'));
      }
    }

    // Save to file
    if (options.save) {
      try {
        writeFileSync(options.save, result, 'utf-8');
        console.log(chalk.green(`\n✓ Saved to ${options.save}`));
      } catch (error) {
        console.error(chalk.red(`\nError saving file: ${error.message}`));
        process.exit(1);
      }
    }
  });

program.parse();
