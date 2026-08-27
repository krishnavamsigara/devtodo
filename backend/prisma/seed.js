import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing records
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const krishna = await prisma.user.create({
    data: {
      name: 'Krishna',
      email: 'admin@example.com',
      password: passwordHash
    }
  });

  const rahul = await prisma.user.create({
    data: {
      name: 'Rahul',
      email: 'user@example.com',
      password: passwordHash
    }
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'developer@example.com',
      password: passwordHash
    }
  });

  console.log('✅ Created users: admin@example.com, user@example.com, developer@example.com');

  // 2. Create Posts
  const postsData = [
    {
      title: 'Learning Linux',
      description:
        'Linux is the backbone of modern cloud computing and server administration. Mastering basic command-line utilities, file permissions, and systemd services is essential for any engineer.',
      category: 'DevOps',
      authorId: krishna.id
    },
    {
      title: 'Introduction to Docker',
      description:
        'Docker packages applications and their dependencies into standardized isolated containers, ensuring seamless execution across development, staging, and production environments.',
      category: 'DevOps',
      authorId: krishna.id
    },
    {
      title: 'Docker Compose Basics',
      description:
        'Docker Compose simplifies multi-container orchestration for local development by defining services, networks, and persistent volumes in a single declarative YAML file.',
      category: 'DevOps',
      authorId: rahul.id
    },
    {
      title: 'Understanding CI/CD',
      description:
        'Continuous Integration and Continuous Deployment automate code testing, building, and deployment, reducing manual overhead and catching integration errors early.',
      category: 'DevOps',
      authorId: alice.id
    },
    {
      title: 'GitHub Actions Automation',
      description:
        'GitHub Actions enables flexible workflow automation directly inside your GitHub repository, running linting, tests, container builds, and deployments on git events.',
      category: 'DevOps',
      authorId: krishna.id
    },
    {
      title: 'What is Kubernetes?',
      description:
        'Kubernetes is an open-source container orchestration engine that handles automated deployment, self-healing, rolling updates, and elastic scaling of containerized apps.',
      category: 'DevOps',
      authorId: rahul.id
    },
    {
      title: 'Kubernetes Pods & Services',
      description:
        'In Kubernetes, Pods represent the smallest deployable compute units, while Services provide stable IP endpoints and load balancing across dynamic pod replicas.',
      category: 'DevOps',
      authorId: alice.id
    },
    {
      title: 'PostgreSQL Basics & Indexing',
      description:
        'PostgreSQL is an enterprise-grade open-source relational database. Understanding B-tree indexes, foreign keys, and query execution plans is key to high-throughput data layers.',
      category: 'Database',
      authorId: rahul.id
    },
    {
      title: 'Database Transactions with Prisma',
      description:
        'Prisma client allows executing interactive database transactions with ACID guarantees, ensuring multi-step mutations either succeed completely or roll back safely.',
      category: 'Database',
      authorId: krishna.id
    },
    {
      title: 'Node.js REST APIs with Express',
      description:
        'Express provides a minimalistic and fast web framework for Node.js. Combining Express with layered service architecture and schema validation delivers maintainable APIs.',
      category: 'Backend',
      authorId: alice.id
    },
    {
      title: 'Clean Architecture in Express',
      description:
        'Separating routes, controllers, validation schemas, and business services isolates domain logic and makes testing straightforward with mocking or integration tests.',
      category: 'Backend',
      authorId: krishna.id
    },
    {
      title: 'React Fundamentals & State',
      description:
        'React makes building interactive user interfaces predictable and declarative through component composition, unidirectional data flow, and functional state hooks.',
      category: 'Frontend',
      authorId: rahul.id
    },
    {
      title: 'Modern JavaScript ES2024 Features',
      description:
        'JavaScript continues to evolve rapidly with pattern matching, record and tuple proposals, Object.groupBy, and top-level await in ECMAScript modules.',
      category: 'Programming',
      authorId: alice.id
    },
    {
      title: 'Building Resilient Microservices',
      description:
        'Exploring patterns for cloud resilience including circuit breakers, graceful degradation, exponential backoff retries, and comprehensive health probes.',
      category: 'Technology',
      authorId: krishna.id
    }
  ];

  for (const post of postsData) {
    await prisma.post.create({ data: post });
  }

  console.log(`✅ Seeded ${postsData.length} posts successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
