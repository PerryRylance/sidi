#!/usr/bin/env node
/*
 * Prepares the libresidfp-main submodule for building:
 *  - applies the Emscripten single-threaded filter-init patch (safe no-op for
 *    non-Emscripten builds, since it's guarded by #ifdef __EMSCRIPTEN__)
 *  - generates the two config headers that libresidfp's autotools build would
 *    normally produce from their .in templates, since we don't run autotools
 *
 * Run this after `git submodule update --init` and whenever libresidfp-main
 * is reset to a fresh checkout of the pinned commit.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SUBMODULE_DIR = path.join(ROOT, "libresidfp-main");
const PATCH_FILE = path.join(ROOT, "patches", "0001-emscripten-single-threaded-filter-init.patch");

const GENERATED_HEADERS = {
	"src/siddefs-fp.h": {
		template: "src/siddefs-fp.h.in",
		substitutions: {
			RESIDFP_BRANCH_HINTS: "1",
			HAVE_BUILTIN_EXPECT: "1",
			PACKAGE_VERSION: "2.6.0",
			RESIDFP_INLINING: "1",
			RESIDFP_INLINE: "inline",
		},
	},
	"src/residfp/sidversion.h": {
		template: "src/residfp/sidversion.h.in",
		substitutions: {
			LIB_MAJOR: "2",
			LIB_MINOR: "6",
			LIB_LEVEL: "0",
		},
	},
};

function fail(message) {
	console.error(`setup-libresidfp: ${message}`);
	process.exit(1);
}

function ensureSubmoduleCheckedOut() {
	if (!fs.existsSync(path.join(SUBMODULE_DIR, ".git")) && !fs.existsSync(path.join(SUBMODULE_DIR, "src"))) {
		fail(
			`libresidfp-main is not checked out. Run "git submodule update --init" from the repo root first.`
		);
	}
}

function applyPatch() {
	const alreadyApplied = (() => {
		try {
			execFileSync("git", ["apply", "--reverse", "--check", PATCH_FILE], {
				cwd: SUBMODULE_DIR,
				stdio: "ignore",
			});
			return true;
		} catch {
			return false;
		}
	})();

	if (alreadyApplied) {
		console.log("setup-libresidfp: Emscripten patch already applied, skipping.");
		return;
	}

	execFileSync("git", ["apply", PATCH_FILE], { cwd: SUBMODULE_DIR, stdio: "inherit" });
	console.log("setup-libresidfp: applied Emscripten single-threaded filter-init patch.");
}

function generateHeaders() {
	for (const [outputRelPath, { template, substitutions }] of Object.entries(GENERATED_HEADERS)) {
		const templatePath = path.join(SUBMODULE_DIR, template);
		const outputPath = path.join(SUBMODULE_DIR, outputRelPath);

		let contents = fs.readFileSync(templatePath, "utf8");
		for (const [name, value] of Object.entries(substitutions)) {
			contents = contents.split(`@${name}@`).join(value);
		}

		fs.mkdirSync(path.dirname(outputPath), { recursive: true });
		fs.writeFileSync(outputPath, contents);
		console.log(`setup-libresidfp: generated ${outputRelPath}`);
	}
}

ensureSubmoduleCheckedOut();
applyPatch();
generateHeaders();
