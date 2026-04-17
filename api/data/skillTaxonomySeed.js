import SkillTaxonomy from "../models/skillTaxonomy.model.js";

const TAXONOMY_DATA = [
	// ─── Languages ───
	{
		canonical: "javascript",
		aliases: ["javascript", "js", "es6", "es2015", "ecmascript", "javascript/typescript"],
		category: "language",
		ecosystem: "javascript",
		relatedTo: ["typescript", "nodejs", "react", "vue", "angular"],
	},
	{
		canonical: "typescript",
		aliases: ["typescript", "ts"],
		category: "language",
		ecosystem: "javascript",
		relatedTo: ["javascript", "angular", "react", "nodejs"],
	},
	{
		canonical: "python",
		aliases: ["python", "python3", "py"],
		category: "language",
		ecosystem: "python",
		relatedTo: ["django", "fastapi", "flask", "tensorflow", "ml"],
	},
	{
		canonical: "rust",
		aliases: ["rust", "rust-lang", "rustlang"],
		category: "language",
		ecosystem: "rust",
		relatedTo: ["wasm", "systems"],
	},
	{
		canonical: "go",
		aliases: ["go", "golang"],
		category: "language",
		ecosystem: "go",
		relatedTo: ["docker", "kubernetes", "devops"],
	},
	{
		canonical: "java",
		aliases: ["java", "jvm"],
		category: "language",
		ecosystem: "java",
		relatedTo: ["spring", "maven", "gradle"],
	},
	{
		canonical: "csharp",
		aliases: ["csharp", "c#", ".net", "dotnet"],
		category: "language",
		ecosystem: "dotnet",
		relatedTo: ["dotnet", "unity", "asp.net"],
	},
	{
		canonical: "php",
		aliases: ["php", "php8", "php7"],
		category: "language",
		ecosystem: "php",
		relatedTo: ["laravel", "wordpress", "symfony"],
	},
	{
		canonical: "ruby",
		aliases: ["ruby", "rb"],
		category: "language",
		ecosystem: "ruby",
		relatedTo: ["rails", "sinatra"],
	},
	{
		canonical: "swift",
		aliases: ["swift"],
		category: "language",
		ecosystem: "apple",
		relatedTo: ["ios", "macos", "xcode"],
	},
	{
		canonical: "kotlin",
		aliases: ["kotlin", "kt"],
		category: "language",
		ecosystem: "java",
		relatedTo: ["android", "java", "spring"],
	},
	{
		canonical: "cpp",
		aliases: ["c++", "cpp", "cplusplus"],
		category: "language",
		ecosystem: "systems",
		relatedTo: ["c", "systems", "embedded"],
	},
	{
		canonical: "c",
		aliases: ["c", "clang"],
		category: "language",
		ecosystem: "systems",
		relatedTo: ["cpp", "systems", "embedded"],
	},

	// ─── Frontend Frameworks ───
	{
		canonical: "react",
		aliases: ["react", "reactjs", "react.js", "jsx"],
		category: "frontend_framework",
		ecosystem: "javascript",
		relatedTo: ["javascript", "redux", "nextjs", "jsx", "hooks"],
	},
	{
		canonical: "vue",
		aliases: ["vue", "vuejs", "vue.js", "vue3", "vuex"],
		category: "frontend_framework",
		ecosystem: "javascript",
		relatedTo: ["javascript", "nuxt", "vuex"],
	},
	{
		canonical: "angular",
		aliases: ["angular", "angularjs", "ng"],
		category: "frontend_framework",
		ecosystem: "javascript",
		relatedTo: ["typescript", "rxjs"],
	},
	{
		canonical: "nextjs",
		aliases: ["nextjs", "next.js", "next"],
		category: "frontend_framework",
		ecosystem: "javascript",
		relatedTo: ["react", "javascript", "vercel"],
	},
	{
		canonical: "svelte",
		aliases: ["svelte", "sveltekit"],
		category: "frontend_framework",
		ecosystem: "javascript",
		relatedTo: ["javascript"],
	},

	// ─── Backend Frameworks ───
	{
		canonical: "nodejs",
		aliases: ["nodejs", "node.js", "node", "express", "expressjs"],
		category: "backend_framework",
		ecosystem: "javascript",
		relatedTo: ["javascript", "typescript", "npm"],
	},
	{
		canonical: "django",
		aliases: ["django", "django-rest-framework", "drf"],
		category: "backend_framework",
		ecosystem: "python",
		relatedTo: ["python"],
	},
	{
		canonical: "fastapi",
		aliases: ["fastapi", "fast-api"],
		category: "backend_framework",
		ecosystem: "python",
		relatedTo: ["python", "pydantic"],
	},
	{
		canonical: "flask",
		aliases: ["flask"],
		category: "backend_framework",
		ecosystem: "python",
		relatedTo: ["python"],
	},
	{
		canonical: "spring",
		aliases: ["spring", "spring-boot", "springboot"],
		category: "backend_framework",
		ecosystem: "java",
		relatedTo: ["java", "kotlin", "maven"],
	},
	{
		canonical: "rails",
		aliases: ["rails", "ruby-on-rails", "ror"],
		category: "backend_framework",
		ecosystem: "ruby",
		relatedTo: ["ruby"],
	},

	// ─── CSS / Styling ───
	{
		canonical: "css",
		aliases: ["css", "css3", "scss", "sass", "less", "styling"],
		category: "styling",
		ecosystem: "frontend",
		relatedTo: ["html", "tailwindcss"],
	},
	{
		canonical: "tailwindcss",
		aliases: ["tailwindcss", "tailwind", "tailwind-css"],
		category: "styling",
		ecosystem: "frontend",
		relatedTo: ["css", "react", "vue"],
	},

	// ─── Databases ───
	{
		canonical: "postgresql",
		aliases: ["postgresql", "postgres", "pg", "psql"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["sql", "database"],
	},
	{
		canonical: "mongodb",
		aliases: ["mongodb", "mongo", "mongoose"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["nosql", "database"],
	},
	{
		canonical: "mysql",
		aliases: ["mysql", "mariadb"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["sql", "database"],
	},
	{
		canonical: "redis",
		aliases: ["redis"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["caching", "database"],
	},
	{
		canonical: "sql",
		aliases: ["sql"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["postgresql", "mysql"],
	},
	{
		canonical: "nosql",
		aliases: ["nosql", "no-sql"],
		category: "database",
		ecosystem: "database",
		relatedTo: ["mongodb", "firebase"],
	},

	// ─── Cloud & DevOps ───
	{
		canonical: "docker",
		aliases: ["docker", "dockerfile", "docker-compose", "containers"],
		category: "devops",
		ecosystem: "devops",
		relatedTo: ["kubernetes", "devops", "ci_cd"],
	},
	{
		canonical: "kubernetes",
		aliases: ["kubernetes", "k8s", "kubectl", "helm"],
		category: "devops",
		ecosystem: "devops",
		relatedTo: ["docker", "devops", "cloud"],
	},
	{
		canonical: "aws",
		aliases: ["aws", "amazon-web-services", "s3", "lambda", "ec2", "dynamodb"],
		category: "cloud",
		ecosystem: "cloud",
		relatedTo: ["cloud", "devops"],
	},
	{
		canonical: "gcp",
		aliases: ["gcp", "google-cloud", "google-cloud-platform"],
		category: "cloud",
		ecosystem: "cloud",
		relatedTo: ["cloud", "devops"],
	},
	{
		canonical: "azure",
		aliases: ["azure", "microsoft-azure"],
		category: "cloud",
		ecosystem: "cloud",
		relatedTo: ["cloud", "devops", "dotnet"],
	},
	{
		canonical: "devops",
		aliases: ["devops", "ci/cd", "ci-cd", "cicd", "github-actions", "jenkins"],
		category: "devops",
		ecosystem: "devops",
		relatedTo: ["docker", "kubernetes", "aws"],
	},
	{
		canonical: "ci_cd",
		aliases: ["ci_cd", "ci/cd", "ci-cd", "continuous-integration", "continuous-deployment"],
		category: "devops",
		ecosystem: "devops",
		relatedTo: ["devops", "github-actions"],
	},

	// ─── ML / AI ───
	{
		canonical: "ml",
		aliases: ["ml", "machine-learning", "machine learning", "ml/ai", "deep-learning"],
		category: "ml",
		ecosystem: "python",
		relatedTo: ["python", "tensorflow", "pytorch", "ai"],
	},
	{
		canonical: "ai",
		aliases: ["ai", "artificial-intelligence", "artificial intelligence", "llm", "gpt", "nlp"],
		category: "ml",
		ecosystem: "python",
		relatedTo: ["ml", "python", "tensorflow"],
	},
	{
		canonical: "tensorflow",
		aliases: ["tensorflow", "tf", "keras"],
		category: "ml",
		ecosystem: "python",
		relatedTo: ["python", "ml", "ai"],
	},
	{
		canonical: "pytorch",
		aliases: ["pytorch", "torch"],
		category: "ml",
		ecosystem: "python",
		relatedTo: ["python", "ml", "ai"],
	},

	// ─── Blockchain ───
	{
		canonical: "solidity",
		aliases: ["solidity", "sol", "smart-contracts", "smart contracts"],
		category: "blockchain",
		ecosystem: "blockchain",
		relatedTo: ["ethereum", "blockchain", "web3"],
	},
	{
		canonical: "blockchain",
		aliases: ["blockchain", "web3", "dapp", "defi"],
		category: "blockchain",
		ecosystem: "blockchain",
		relatedTo: ["solidity", "ethereum"],
	},
	{
		canonical: "ethereum",
		aliases: ["ethereum", "eth", "evm"],
		category: "blockchain",
		ecosystem: "blockchain",
		relatedTo: ["solidity", "blockchain"],
	},

	// ─── Other Tools ───
	{
		canonical: "firebase",
		aliases: ["firebase", "firestore", "firebase-auth"],
		category: "baas",
		ecosystem: "google",
		relatedTo: ["nosql", "javascript", "cloud"],
	},
	{
		canonical: "graphql",
		aliases: ["graphql", "gql", "apollo"],
		category: "api",
		ecosystem: "javascript",
		relatedTo: ["javascript", "react", "nodejs"],
	},
	{
		canonical: "rest",
		aliases: ["rest", "restful", "rest-api"],
		category: "api",
		ecosystem: "general",
		relatedTo: ["nodejs", "django", "spring"],
	},
	{
		canonical: "git",
		aliases: ["git", "github", "gitlab", "version-control"],
		category: "tool",
		ecosystem: "general",
		relatedTo: ["devops"],
	},
	{
		canonical: "testing",
		aliases: ["testing", "jest", "mocha", "cypress", "pytest", "unittest", "tdd", "e2e"],
		category: "testing",
		ecosystem: "general",
		relatedTo: ["javascript", "python"],
	},
	{
		canonical: "html",
		aliases: ["html", "html5"],
		category: "markup",
		ecosystem: "frontend",
		relatedTo: ["css", "javascript"],
	},
];

/**
 * Seed the skill taxonomy collection.
 * Uses upsert to avoid duplicates on repeated runs.
 */
export async function seedSkillTaxonomy() {
	let seeded = 0;
	let skipped = 0;

	for (const entry of TAXONOMY_DATA) {
		try {
			await SkillTaxonomy.findOneAndUpdate(
				{ canonical: entry.canonical },
				{ $set: entry },
				{ upsert: true, new: true }
			);
			seeded++;
		} catch (err) {
			// Skip duplicates silently
			skipped++;
		}
	}

	console.log(
		`[TAXONOMY SEED] ✓ ${seeded} skills seeded, ${skipped} skipped`
	);
	return { seeded, skipped };
}

export default TAXONOMY_DATA;
