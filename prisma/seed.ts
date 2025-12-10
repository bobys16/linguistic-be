import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create modules
  const workingMemoryModule = await prisma.module.upsert({
    where: { order: 1 },
    update: {},
    create: {
      title: 'Working Memory',
      description: 'Explore how working memory functions in language processing',
      type: 'WORKING_MEMORY',
      order: 1,
    },
  });

  const processingSpeedModule = await prisma.module.upsert({
    where: { order: 2 },
    update: {},
    create: {
      title: 'Processing Speed',
      description: 'Measure and understand language processing speed',
      type: 'PROCESSING_SPEED',
      order: 2,
    },
  });

  const noticingModule = await prisma.module.upsert({
    where: { order: 3 },
    update: {},
    create: {
      title: 'Noticing',
      description: 'Develop awareness of linguistic forms and patterns',
      type: 'NOTICING',
      order: 3,
    },
  });

  const reflectionModule = await prisma.module.upsert({
    where: { order: 4 },
    update: {},
    create: {
      title: 'Reflective Practice',
      description: 'Reflect on your language learning journey',
      type: 'REFLECTIVE_PRACTICE',
      order: 4,
    },
  });

  console.log('✅ Modules created');

  // Create Working Memory tasks
  await prisma.task.upsert({
    where: { id: 'wm-digit-span-1' },
    update: {},
    create: {
      id: 'wm-digit-span-1',
      moduleId: workingMemoryModule.id,
      title: 'Digit Span - Easy',
      description: 'Remember short sequences of digits (3-5 digits)',
      type: 'DIGIT_SPAN',
      instructions: 'You will see sequences of digits. Try to remember them in order and type them back.',
      order: 1,
      config: {
        trials: 5,
        correctSequences: [
          [3, 7, 2],
          [5, 9, 1, 4],
          [8, 2, 6, 3, 9],
          [4, 1, 7, 5, 2, 8],
          [9, 3, 6, 1, 4, 7, 2],
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'wm-digit-span-2' },
    update: {},
    create: {
      id: 'wm-digit-span-2',
      moduleId: workingMemoryModule.id,
      title: 'Digit Span - Medium',
      description: 'Remember medium sequences of digits (4-7 digits)',
      type: 'DIGIT_SPAN',
      instructions: 'Sequences are getting longer. Focus and remember each digit in order.',
      order: 2,
      config: {
        trials: 5,
        correctSequences: [
          [7, 4, 9, 2],
          [3, 8, 1, 6, 5],
          [9, 2, 7, 4, 1, 8],
          [5, 3, 9, 1, 7, 4, 6],
          [8, 2, 5, 9, 3, 7, 1, 4],
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'wm-digit-span-3' },
    update: {},
    create: {
      id: 'wm-digit-span-3',
      moduleId: workingMemoryModule.id,
      title: 'Digit Span - Challenge',
      description: 'Remember long sequences of digits (6-9 digits)',
      type: 'DIGIT_SPAN',
      instructions: 'Expert level! These sequences are very long. Take your time to memorize.',
      order: 3,
      config: {
        trials: 5,
        correctSequences: [
          [4, 9, 2, 7, 1, 6],
          [8, 3, 5, 1, 9, 4, 2],
          [7, 2, 9, 4, 1, 6, 8, 3],
          [5, 9, 3, 7, 2, 8, 4, 1, 6],
          [9, 1, 6, 3, 8, 2, 7, 5, 4, 1],
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'wm-reading-span-1' },
    update: {},
    create: {
      id: 'wm-reading-span-1',
      moduleId: workingMemoryModule.id,
      title: 'Reading Span - Beginner',
      description: 'Read simple sentences and remember the last word',
      type: 'READING_SPAN',
      instructions: 'Read each sentence carefully. At the end, recall the last word of each sentence.',
      order: 4,
      config: {
        sentences: [
          { text: 'The cat sat on the mat.', lastWord: 'mat' },
          { text: 'She bought a new car.', lastWord: 'car' },
          { text: 'The sun is shining bright.', lastWord: 'bright' },
        ],
        correctWords: ['mat', 'car', 'bright'],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'wm-reading-span-2' },
    update: {},
    create: {
      id: 'wm-reading-span-2',
      moduleId: workingMemoryModule.id,
      title: 'Reading Span - Intermediate',
      description: 'Read longer sentences and remember final words',
      type: 'READING_SPAN',
      instructions: 'Read each sentence and remember the last word. Sentences are getting longer!',
      order: 5,
      config: {
        sentences: [
          { text: 'The detective investigated the mysterious crime scene carefully.', lastWord: 'carefully' },
          { text: 'Students studied diligently for their upcoming final examination.', lastWord: 'examination' },
          { text: 'The orchestra performed a beautiful symphony for the audience.', lastWord: 'audience' },
          { text: 'Scientists discovered a new species in the rainforest.', lastWord: 'rainforest' },
        ],
        correctWords: ['carefully', 'examination', 'audience', 'rainforest'],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'wm-reading-span-3' },
    update: {},
    create: {
      id: 'wm-reading-span-3',
      moduleId: workingMemoryModule.id,
      title: 'Reading Span - Advanced',
      description: 'Read complex sentences and recall multiple final words',
      type: 'READING_SPAN',
      instructions: 'Advanced level! Read complex sentences and remember all the final words in order.',
      order: 6,
      config: {
        sentences: [
          { text: 'The pharmaceutical company announced breakthrough research results yesterday.', lastWord: 'yesterday' },
          { text: 'Economic indicators suggest significant market volatility ahead.', lastWord: 'ahead' },
          { text: 'Archaeologists unearthed ancient artifacts from the civilization.', lastWord: 'civilization' },
          { text: 'The implementation requires comprehensive documentation throughout.', lastWord: 'throughout' },
          { text: 'Environmental conservation efforts continue worldwide.', lastWord: 'worldwide' },
        ],
        correctWords: ['yesterday', 'ahead', 'civilization', 'throughout', 'worldwide'],
      },
    },
  });

  console.log('✅ Working Memory tasks created');

  // Create Processing Speed tasks
  await prisma.task.upsert({
    where: { id: 'ps-lexical-1' },
    update: {},
    create: {
      id: 'ps-lexical-1',
      moduleId: processingSpeedModule.id,
      title: 'Lexical Decision - Common Words',
      description: 'Identify real words vs pseudowords (common vocabulary)',
      type: 'LEXICAL_DECISION',
      instructions: 'Press YES if the item is a real word, NO if it is not. Be as fast and accurate as possible.',
      order: 1,
      config: {
        items: [
          { word: 'table', isWord: true },
          { word: 'blick', isWord: false },
          { word: 'chair', isWord: true },
          { word: 'flurg', isWord: false },
          { word: 'book', isWord: true },
          { word: 'plome', isWord: false },
          { word: 'computer', isWord: true },
          { word: 'drook', isWord: false },
          { word: 'friend', isWord: true },
          { word: 'snurt', isWord: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ps-lexical-2' },
    update: {},
    create: {
      id: 'ps-lexical-2',
      moduleId: processingSpeedModule.id,
      title: 'Lexical Decision - Academic Words',
      description: 'Identify real words vs pseudowords (academic vocabulary)',
      type: 'LEXICAL_DECISION',
      instructions: 'Decide quickly! These words are more advanced.',
      order: 2,
      config: {
        items: [
          { word: 'hypothesis', isWord: true },
          { word: 'graplize', isWord: false },
          { word: 'analysis', isWord: true },
          { word: 'frendify', isWord: false },
          { word: 'cognitive', isWord: true },
          { word: 'blortant', isWord: false },
          { word: 'phenomenon', isWord: true },
          { word: 'cromplish', isWord: false },
          { word: 'theoretical', isWord: true },
          { word: 'flumberate', isWord: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ps-lexical-3' },
    update: {},
    create: {
      id: 'ps-lexical-3',
      moduleId: processingSpeedModule.id,
      title: 'Lexical Decision - Mixed Difficulty',
      description: 'Identify real words vs pseudowords (all levels)',
      type: 'LEXICAL_DECISION',
      instructions: 'Fast thinking required! Mix of easy and hard words.',
      order: 3,
      config: {
        items: [
          { word: 'cat', isWord: true },
          { word: 'zib', isWord: false },
          { word: 'magnificent', isWord: true },
          { word: 'blorticate', isWord: false },
          { word: 'run', isWord: true },
          { word: 'prund', isWord: false },
          { word: 'philosophical', isWord: true },
          { word: 'clompish', isWord: false },
          { word: 'happy', isWord: true },
          { word: 'slurch', isWord: false },
          { word: 'extraordinary', isWord: true },
          { word: 'gribulate', isWord: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ps-sentence-1' },
    update: {},
    create: {
      id: 'ps-sentence-1',
      moduleId: processingSpeedModule.id,
      title: 'Sentence Verification - General Knowledge',
      description: 'Quickly verify if statements are true or false',
      type: 'SENTENCE_VERIFICATION',
      instructions: 'Read each sentence and decide if it is TRUE or FALSE as quickly as possible.',
      order: 4,
      config: {
        sentences: [
          { text: 'The sun rises in the east.', isTrue: true },
          { text: 'Water freezes at 100 degrees Celsius.', isTrue: false },
          { text: 'Paris is the capital of France.', isTrue: true },
          { text: 'There are 8 days in a week.', isTrue: false },
          { text: 'Dogs are mammals.', isTrue: true },
          { text: 'The moon is larger than Earth.', isTrue: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ps-sentence-2' },
    update: {},
    create: {
      id: 'ps-sentence-2',
      moduleId: processingSpeedModule.id,
      title: 'Sentence Verification - Science Facts',
      description: 'Verify scientific statements quickly',
      type: 'SENTENCE_VERIFICATION',
      instructions: 'Science facts - true or false? Be quick!',
      order: 5,
      config: {
        sentences: [
          { text: 'Oxygen is necessary for human breathing.', isTrue: true },
          { text: 'Light travels slower than sound.', isTrue: false },
          { text: 'The Earth orbits around the Sun.', isTrue: true },
          { text: 'Humans have five hearts.', isTrue: false },
          { text: 'Plants produce oxygen through photosynthesis.', isTrue: true },
          { text: 'All planets in our solar system are made of gas.', isTrue: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ps-sentence-3' },
    update: {},
    create: {
      id: 'ps-sentence-3',
      moduleId: processingSpeedModule.id,
      title: 'Sentence Verification - Mixed Topics',
      description: 'Verify statements from various domains',
      type: 'SENTENCE_VERIFICATION',
      instructions: 'Mixed knowledge test - decide quickly!',
      order: 6,
      config: {
        sentences: [
          { text: 'Shakespeare wrote Romeo and Juliet.', isTrue: true },
          { text: 'Australia is in the Northern Hemisphere.', isTrue: false },
          { text: 'The Internet was invented in the 20th century.', isTrue: true },
          { text: 'Triangles have four sides.', isTrue: false },
          { text: 'Coffee contains caffeine.', isTrue: true },
          { text: 'The Pacific Ocean is the smallest ocean.', isTrue: false },
          { text: 'Penguins can fly long distances.', isTrue: false },
          { text: 'Gold is a chemical element.', isTrue: true },
        ],
      },
    },
  });

  console.log('✅ Processing Speed tasks created');

  // Create Noticing tasks
  await prisma.task.upsert({
    where: { id: 'not-form-meaning-1' },
    update: {},
    create: {
      id: 'not-form-meaning-1',
      moduleId: noticingModule.id,
      title: 'Form-Meaning Mapping - Verb Tenses',
      description: 'Match verb forms with their temporal meanings',
      type: 'FORM_MEANING_MAPPING',
      instructions: 'Match each grammatical form with its correct meaning or function.',
      order: 1,
      config: {
        correctMappings: [
          { form: 'past tense -ed', meaning: 'completed action' },
          { form: 'present continuous -ing', meaning: 'ongoing action' },
          { form: 'modal will', meaning: 'future prediction' },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'not-form-meaning-2' },
    update: {},
    create: {
      id: 'not-form-meaning-2',
      moduleId: noticingModule.id,
      title: 'Form-Meaning Mapping - Articles',
      description: 'Match articles with their usage contexts',
      type: 'FORM_MEANING_MAPPING',
      instructions: 'Match each article form with when it should be used.',
      order: 2,
      config: {
        correctMappings: [
          { form: 'the', meaning: 'specific/definite reference' },
          { form: 'a/an', meaning: 'non-specific/indefinite reference' },
          { form: 'no article', meaning: 'general/plural reference' },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'not-form-meaning-3' },
    update: {},
    create: {
      id: 'not-form-meaning-3',
      moduleId: noticingModule.id,
      title: 'Form-Meaning Mapping - Modal Verbs',
      description: 'Match modal verbs with their meanings',
      type: 'FORM_MEANING_MAPPING',
      instructions: 'Match each modal verb with its primary meaning.',
      order: 3,
      config: {
        correctMappings: [
          { form: 'must', meaning: 'obligation/necessity' },
          { form: 'can', meaning: 'ability/possibility' },
          { form: 'should', meaning: 'advice/recommendation' },
          { form: 'might', meaning: 'low possibility' },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'not-error-correction-1' },
    update: {},
    create: {
      id: 'not-error-correction-1',
      moduleId: noticingModule.id,
      title: 'Error Correction - Basic Grammar',
      description: 'Identify and correct basic grammatical errors',
      type: 'ERROR_CORRECTION',
      instructions: 'Find the error in each sentence and write the corrected version.',
      order: 4,
      config: {
        sentences: [
          {
            original: 'She go to school every day.',
            correctedVersion: 'she goes to school every day.',
            error: 'subject-verb agreement',
          },
          {
            original: 'They was happy yesterday.',
            correctedVersion: 'they were happy yesterday.',
            error: 'verb form',
          },
          {
            original: 'I have saw that movie.',
            correctedVersion: 'i have seen that movie.',
            error: 'past participle',
          },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'not-error-correction-2' },
    update: {},
    create: {
      id: 'not-error-correction-2',
      moduleId: noticingModule.id,
      title: 'Error Correction - Intermediate',
      description: 'Correct more complex grammatical errors',
      type: 'ERROR_CORRECTION',
      instructions: 'Find and correct the grammatical error in each sentence.',
      order: 5,
      config: {
        sentences: [
          {
            original: 'He dont like coffee.',
            correctedVersion: 'he doesn\'t like coffee.',
            error: 'auxiliary verb contraction',
          },
          {
            original: 'She have been studying for three hours.',
            correctedVersion: 'she has been studying for three hours.',
            error: 'subject-verb agreement with perfect tense',
          },
          {
            original: 'The book what I read was interesting.',
            correctedVersion: 'the book that i read was interesting.',
            error: 'relative pronoun',
          },
          {
            original: 'I am here since morning.',
            correctedVersion: 'i have been here since morning.',
            error: 'present perfect vs present simple',
          },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'not-error-correction-3' },
    update: {},
    create: {
      id: 'not-error-correction-3',
      moduleId: noticingModule.id,
      title: 'Error Correction - Advanced',
      description: 'Correct subtle and complex grammatical errors',
      type: 'ERROR_CORRECTION',
      instructions: 'These errors are subtle. Read carefully and correct them.',
      order: 6,
      config: {
        sentences: [
          {
            original: 'If I would have known, I would have come.',
            correctedVersion: 'if i had known, i would have come.',
            error: 'conditional perfect',
          },
          {
            original: 'The data shows interesting results.',
            correctedVersion: 'the data show interesting results.',
            error: 'plural form of data',
          },
          {
            original: 'She suggested me to study harder.',
            correctedVersion: 'she suggested that i study harder.',
            error: 'suggest + that clause',
          },
          {
            original: 'Despite of the rain, we went out.',
            correctedVersion: 'despite the rain, we went out.',
            error: 'despite vs despite of',
          },
        ],
      },
    },
  });

  console.log('✅ Noticing tasks created');

  // Create Reflection tasks - 3 Guided + 3 Free
  await prisma.task.upsert({
    where: { id: 'ref-guided-1' },
    update: {},
    create: {
      id: 'ref-guided-1',
      moduleId: reflectionModule.id,
      title: 'Guided Reflection: Working Memory',
      description: 'Reflect on your working memory performance (Beginner)',
      type: 'GUIDED_REFLECTION',
      instructions: 'Answer the following reflection questions about your experience with working memory tasks.',
      order: 19,
      config: {
        prompts: [
          'What strategies did you use to remember the information?',
          'Which task was most challenging and why?',
          'How might working memory affect language learning?',
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ref-guided-2' },
    update: {},
    create: {
      id: 'ref-guided-2',
      moduleId: reflectionModule.id,
      title: 'Guided Reflection: Processing Speed',
      description: 'Reflect on speed vs accuracy in language tasks (Intermediate)',
      type: 'GUIDED_REFLECTION',
      instructions: 'Reflect on your processing speed performance and think about the relationship between speed and accuracy.',
      order: 20,
      config: {
        prompts: [
          'Did you prioritize speed or accuracy? Why?',
          'How did time pressure affect your performance?',
          'What cognitive processes were you aware of during rapid decision-making?',
          'How might processing speed relate to real-world language use (e.g., conversations)?',
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ref-guided-3' },
    update: {},
    create: {
      id: 'ref-guided-3',
      moduleId: reflectionModule.id,
      title: 'Guided Reflection: Noticing Skills',
      description: 'Reflect on pattern recognition and error awareness (Advanced)',
      type: 'GUIDED_REFLECTION',
      instructions: 'Analyze your noticing abilities and how attention affects language learning.',
      order: 21,
      config: {
        prompts: [
          'What patterns did you notice in the form-meaning mapping tasks?',
          'How do you identify errors in your own language production?',
          'What role does conscious attention play in noticing grammatical features?',
          'How might you improve your noticing skills in everyday language exposure?',
          'Can you connect your noticing experience to Schmidt\'s Noticing Hypothesis?',
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ref-free-1' },
    update: {},
    create: {
      id: 'ref-free-1',
      moduleId: reflectionModule.id,
      title: 'Weekly Learning Journal',
      description: 'Write about your weekly progress (Beginner)',
      type: 'FREE_REFLECTION',
      instructions: 'Write freely about your experiences this week. What did you learn? What surprised you? What questions do you have?',
      order: 22,
      config: {
        minWords: 100,
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ref-free-2' },
    update: {},
    create: {
      id: 'ref-free-2',
      moduleId: reflectionModule.id,
      title: 'Deep Dive Analysis',
      description: 'Analytical reflection on your cognitive processes (Intermediate)',
      type: 'FREE_REFLECTION',
      instructions: 'Write a detailed analysis of your performance across different task types. Compare your strengths and weaknesses, and explain what you think accounts for these patterns.',
      order: 23,
      config: {
        minWords: 200,
      },
    },
  });

  await prisma.task.upsert({
    where: { id: 'ref-free-3' },
    update: {},
    create: {
      id: 'ref-free-3',
      moduleId: reflectionModule.id,
      title: 'Research Synthesis',
      description: 'Connect your experience to psycholinguistic theory (Advanced)',
      type: 'FREE_REFLECTION',
      instructions: 'Write a synthesis that connects your task experiences to psycholinguistic research and theory. Consider working memory models, language processing theories, skill acquisition, and metacognition. Support your reflections with specific examples.',
      order: 24,
      config: {
        minWords: 300,
      },
    },
  });

  console.log('✅ Reflection tasks created (6 tasks: 3 guided + 3 free)');

  // Create a demo user (password: 'password123')
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      // Hash for 'password123' - in production, use proper bcrypt hashing
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7JqKr0MBqi',
      name: 'Demo User',
    },
  });

  console.log('✅ Demo user created (demo@example.com / password123)');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
