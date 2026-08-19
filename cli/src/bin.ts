#!/usr/bin/env node
/**
 * `contextrocket` CLI entrypoint -- thin argument parser + dispatcher.
 *
 * Mirrors the argparse command surface of the Python reference CLI. The backend
 * target DEFAULTS to production; `--local` switches to the localhost:8000 dev
 * backend. Precedence: `--api-base` > CONTEXTROCKET_API_BASE env > `--local` >
 * production default.
 *
 *   contextrocket [--api-base URL] auth login [--no-launch-browser]
 *   contextrocket [--api-base URL] auth print-access-token
 *   contextrocket [--api-base URL] auth whoami
 *   contextrocket [--api-base URL] auth logout
 *   contextrocket [--api-base URL] content cp   <source> <dest>
 *   contextrocket [--api-base URL] content cat  <address>
 *   contextrocket [--api-base URL] content ls   <address>
 *   contextrocket [--api-base URL] content rm   <address>
 *   contextrocket [--api-base URL] content sync <source> <dest>
 *   contextrocket [--api-base URL] content query <address> <query> [--folder F] [--limit N]
 *   contextrocket [--api-base URL] admin create-org  --slug S --name N
 *   contextrocket [--api-base URL] admin create-user --org-slug S --email E [--password P] [--role R]
 *   contextrocket [--api-base URL] sites publish --org <handle> --dir <built out/ dir>
 *   contextrocket [--api-base URL] sources ls --org <handle>
 *   contextrocket [--api-base URL] sources upload --org <handle> --file PATH [--type TYPE]
 *   contextrocket [--api-base URL] sources download --org <handle> --id ID --out PATH
 *   contextrocket [--api-base URL] sources rm --org <handle> --id ID
 */

import * as cli from "./cli.js";
import { banner, FOOTER, eprintln } from "./branding.js";

interface Parsed {
  apiBase?: string;
  positionals: string[];
  flags: Set<string>;
  options: Record<string, string>;
}

/** Split argv into a global --api-base, positionals, boolean flags, and --k v options. */
function parse(argv: string[]): Parsed {
  const positionals: string[] = [];
  const flags = new Set<string>();
  const options: Record<string, string> = {};
  let apiBase: string | undefined;

  const booleanFlags = new Set(["--no-launch-browser", "--local"]);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--api-base") {
      apiBase = argv[++i];
    } else if (arg.startsWith("--api-base=")) {
      apiBase = arg.slice("--api-base=".length);
    } else if (booleanFlags.has(arg)) {
      flags.add(arg);
    } else if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq !== -1) {
        options[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        options[arg.slice(2)] = argv[++i];
      }
    } else {
      positionals.push(arg);
    }
  }
  return { apiBase, positionals, flags, options };
}

function usage(): void {
  eprintln(banner("operator CLI"));
  eprintln("");
  eprintln("Usage:");
  eprintln("  contextrocket [--api-base URL] [--local] auth <login|print-access-token|whoami|logout>");
  eprintln("  contextrocket [--api-base URL] [--local] content <cp|sync|ls|rm|cat|query> ...");
  eprintln("  contextrocket [--api-base URL] [--local] admin <create-org|create-user> ...");
  eprintln("  contextrocket [--api-base URL] [--local] sites publish --org <handle> --dir <built out/ dir>");
  eprintln("  contextrocket [--api-base URL] [--local] sources <ls|upload|download|rm> --org <handle> ...");
  eprintln("");
  eprintln("Target: defaults to production (https://app-api.contextrocket.com).");
  eprintln("  --local            target the localhost:8000 dev backend");
  eprintln("  --api-base <url>    explicit base (wins over --local and the env var)");
  eprintln("  CONTEXTROCKET_API_BASE env wins over --local; --api-base wins over all.");
  eprintln("");
  eprintln(FOOTER);
}

export async function main(argv: string[]): Promise<number> {
  const { apiBase, positionals, flags, options } = parse(argv);
  // `--local` targets the localhost dev backend; the default is production. An
  // explicit `--api-base` (or the CONTEXTROCKET_API_BASE env) always wins.
  const opts = { apiBase, local: flags.has("--local") };
  const [group, command, ...rest] = positionals;

  if (!group) {
    usage();
    return 2;
  }

  if (group === "auth") {
    switch (command) {
      case "login":
        return cli.cmdAuthLogin({ ...opts, noLaunchBrowser: flags.has("--no-launch-browser") });
      case "print-access-token":
        return cli.cmdAuthPrintAccessToken(opts);
      case "whoami":
        return cli.cmdAuthWhoami(opts);
      case "logout":
        return cli.cmdAuthLogout(opts);
      default:
        eprintln(`error: unknown auth command '${command ?? ""}'`);
        return 2;
    }
  }

  if (group === "content") {
    switch (command) {
      case "cp":
        if (rest.length < 2) {
          eprintln("error: content cp requires <source> <dest>");
          return 2;
        }
        return cli.cmdContentCp(opts, rest[0], rest[1]);
      case "cat":
        if (rest.length < 1) {
          eprintln("error: content cat requires <address>");
          return 2;
        }
        return cli.cmdContentCat(opts, rest[0]);
      case "ls":
        if (rest.length < 1) {
          eprintln("error: content ls requires <address>");
          return 2;
        }
        return cli.cmdContentLs(opts, rest[0]);
      case "rm":
        if (rest.length < 1) {
          eprintln("error: content rm requires <address>");
          return 2;
        }
        return cli.cmdContentRm(opts, rest[0]);
      case "sync":
        if (rest.length < 2) {
          eprintln("error: content sync requires <source> <dest>");
          return 2;
        }
        return cli.cmdContentSync(opts, rest[0], rest[1]);
      case "query":
        return cli.cmdContentQuery(opts);
      default:
        eprintln(`error: unknown content command '${command ?? ""}'`);
        return 2;
    }
  }

  if (group === "admin") {
    switch (command) {
      case "create-org": {
        const slug = options.slug;
        const name = options.name;
        if (!slug || !name) {
          eprintln("error: admin create-org requires --slug and --name");
          return 2;
        }
        return cli.cmdAdminCreateOrg(opts, slug, name);
      }
      case "create-user": {
        const orgSlug = options["org-slug"];
        const email = options.email;
        if (!orgSlug || !email) {
          eprintln("error: admin create-user requires --org-slug and --email");
          return 2;
        }
        return cli.cmdAdminCreateUser(opts, {
          orgSlug,
          email,
          password: options.password,
          role: options.role ?? "admin",
        });
      }
      default:
        eprintln(`error: unknown admin command '${command ?? ""}'`);
        return 2;
    }
  }

  if (group === "sites") {
    switch (command) {
      case "publish": {
        const org = options.org;
        const dir = options.dir;
        if (!org || !dir) {
          eprintln("error: sites publish requires --org <handle> and --dir <built out/ dir>");
          return 2;
        }
        return cli.cmdSitesPublish(opts, { org, dir });
      }
      default:
        eprintln(`error: unknown sites command '${command ?? ""}'`);
        return 2;
    }
  }

  if (group === "sources") {
    const org = options.org;
    if (!org) {
      eprintln("error: sources commands require --org <handle>");
      return 2;
    }
    switch (command) {
      case "ls":
        return cli.cmdSourcesLs(opts, { org, limit: options.limit, offset: options.offset });
      case "upload": {
        const file = options.file;
        if (!file) {
          eprintln("error: sources upload requires --file <path>");
          return 2;
        }
        return cli.cmdSourcesUpload(opts, {
          org,
          file,
          sourceType: options.type ?? "uploaded_document",
          contextScope: options.scope ?? "company",
          description: options.description,
        });
      }
      case "download": {
        const id = options.id;
        const out = options.out;
        if (!id || !out) {
          eprintln("error: sources download requires --id <source id> and --out <path>");
          return 2;
        }
        return cli.cmdSourcesDownload(opts, { org, id, out });
      }
      case "rm": {
        const id = options.id;
        if (!id) {
          eprintln("error: sources rm requires --id <source id>");
          return 2;
        }
        return cli.cmdSourcesRm(opts, { org, id });
      }
      default:
        eprintln(`error: unknown sources command '${command ?? ""}'`);
        return 2;
    }
  }

  eprintln(`error: unknown command group '${group}'`);
  usage();
  return 2;
}

// Only auto-run when invoked as the entrypoint (not when imported by tests).
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((err) => {
      eprintln(`error: ${(err as Error).message}`);
      process.exit(1);
    });
}
