import { TaskType } from '@prisma/client';

interface AttemptResponse {
  [key: string]: any;
}

interface ScoringResult {
  score: number;
  accuracy?: number;
  reactionTime?: number;
  metadata?: any;
}

export class ScoringService {
  calculateScore(taskType: TaskType, response: AttemptResponse, config: any): ScoringResult {
    switch (taskType) {
      case TaskType.DIGIT_SPAN:
        return this.scoreDigitSpan(response, config);
      
      case TaskType.READING_SPAN:
        return this.scoreReadingSpan(response, config);
      
      case TaskType.LEXICAL_DECISION:
        return this.scoreLexicalDecision(response, config);
      
      case TaskType.SENTENCE_VERIFICATION:
        return this.scoreSentenceVerification(response, config);
      
      case TaskType.FORM_MEANING_MAPPING:
        return this.scoreFormMeaningMapping(response, config);
      
      case TaskType.ERROR_CORRECTION:
        return this.scoreErrorCorrection(response, config);
      
      case TaskType.GUIDED_REFLECTION:
      case TaskType.FREE_REFLECTION:
        return this.scoreReflection(response);
      
      default:
        return { score: 0, accuracy: 0 };
    }
  }

  private scoreDigitSpan(response: AttemptResponse, config: any): ScoringResult {
    const { trials } = response;
    const { correctSequences } = config;

    if (!trials || !Array.isArray(trials)) {
      return { score: 0, accuracy: 0 };
    }

    let correctCount = 0;
    let totalTrials = trials.length;

    trials.forEach((trial: any, index: number) => {
      const correctSequence = correctSequences[index];
      const userSequence = trial.userInput;

      if (JSON.stringify(userSequence) === JSON.stringify(correctSequence)) {
        correctCount++;
      }
    });

    const accuracy = totalTrials > 0 ? (correctCount / totalTrials) * 100 : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      metadata: {
        correctTrials: correctCount,
        totalTrials,
      },
    };
  }

  private scoreReadingSpan(response: AttemptResponse, config: any): ScoringResult {
    const { correctWords } = config;

    // Support both formats: recalledWords array or trials array
    let recalledWords: string[] = [];
    
    if (response.recalledWords && Array.isArray(response.recalledWords)) {
      recalledWords = response.recalledWords;
    } else if (response.trials && Array.isArray(response.trials) && response.trials.length > 0) {
      // Extract userInput from first trial
      recalledWords = response.trials[0].userInput || [];
    }

    if (!recalledWords || recalledWords.length === 0) {
      return { score: 0, accuracy: 0, metadata: { correctWords: 0, totalWords: correctWords.length, recalledWords: 0 } };
    }

    let correctCount = 0;
    const totalWords = correctWords.length;

    recalledWords.forEach((word: string) => {
      if (correctWords.includes(word.toLowerCase().trim())) {
        correctCount++;
      }
    });

    const accuracy = totalWords > 0 ? (correctCount / totalWords) * 100 : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      metadata: {
        correctWords: correctCount,
        totalWords,
        recalledWords: recalledWords.length,
      },
    };
  }

  private scoreLexicalDecision(response: AttemptResponse, config: any): ScoringResult {
    const { trials } = response;
    const { items } = config;

    if (!trials || !Array.isArray(trials)) {
      return { score: 0, accuracy: 0, reactionTime: 0 };
    }

    let correctCount = 0;
    let totalReactionTime = 0;
    const totalTrials = trials.length;

    trials.forEach((trial: any, index: number) => {
      const correctAnswer = items[index]?.isWord;
      const userAnswer = trial.response;
      const reactionTime = trial.reactionTime || 0;

      if (userAnswer === correctAnswer) {
        correctCount++;
      }

      totalReactionTime += reactionTime;
    });

    const accuracy = totalTrials > 0 ? (correctCount / totalTrials) * 100 : 0;
    const avgReactionTime = totalTrials > 0 ? totalReactionTime / totalTrials : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      reactionTime: avgReactionTime,
      metadata: {
        correctResponses: correctCount,
        totalTrials,
        totalReactionTime,
      },
    };
  }

  private scoreSentenceVerification(response: AttemptResponse, config: any): ScoringResult {
    const { trials } = response;
    const { sentences } = config;

    if (!trials || !Array.isArray(trials)) {
      return { score: 0, accuracy: 0, reactionTime: 0 };
    }

    let correctCount = 0;
    let totalReactionTime = 0;
    const totalTrials = trials.length;

    trials.forEach((trial: any, index: number) => {
      const correctAnswer = sentences[index]?.isTrue;
      const userAnswer = trial.response;
      const reactionTime = trial.reactionTime || 0;

      if (userAnswer === correctAnswer) {
        correctCount++;
      }

      totalReactionTime += reactionTime;
    });

    const accuracy = totalTrials > 0 ? (correctCount / totalTrials) * 100 : 0;
    const avgReactionTime = totalTrials > 0 ? totalReactionTime / totalTrials : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      reactionTime: avgReactionTime,
      metadata: {
        correctResponses: correctCount,
        totalTrials,
        totalReactionTime,
      },
    };
  }

  private scoreFormMeaningMapping(response: AttemptResponse, config: any): ScoringResult {
    const { mappings } = response;
    const { correctMappings } = config;

    if (!mappings || !Array.isArray(mappings)) {
      return { score: 0, accuracy: 0 };
    }

    let correctCount = 0;
    const totalMappings = mappings.length;

    mappings.forEach((mapping: any, index: number) => {
      const correctMapping = correctMappings[index];
      
      // Support both 'meaning' and 'selectedMeaning' from frontend
      const userMeaning = mapping.meaning || mapping.selectedMeaning;
      
      if (mapping.form === correctMapping.form && 
          userMeaning === correctMapping.meaning) {
        correctCount++;
      }
    });

    const accuracy = totalMappings > 0 ? (correctCount / totalMappings) * 100 : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      metadata: {
        correctMappings: correctCount,
        totalMappings,
      },
    };
  }

  private scoreErrorCorrection(response: AttemptResponse, config: any): ScoringResult {
    const { corrections } = response;
    const { sentences } = config;

    if (!corrections || !Array.isArray(corrections)) {
      return { score: 0, accuracy: 0 };
    }

    let correctCount = 0;
    const totalSentences = corrections.length;

    corrections.forEach((correction: any, index: number) => {
      const correctSentence = sentences[index]?.correctedVersion;
      const userCorrection = correction.correctedSentence;

      // Normalize and compare
      const normalizedCorrect = correctSentence?.toLowerCase().trim();
      const normalizedUser = userCorrection?.toLowerCase().trim();

      if (normalizedUser === normalizedCorrect) {
        correctCount++;
      }
    });

    const accuracy = totalSentences > 0 ? (correctCount / totalSentences) * 100 : 0;
    const score = correctCount;

    return {
      score,
      accuracy,
      metadata: {
        correctCorrections: correctCount,
        totalSentences,
      },
    };
  }

  private scoreReflection(_response: AttemptResponse): ScoringResult {
    // Reflections don't have a score
    return {
      score: 0,
      accuracy: undefined,
      reactionTime: undefined,
      metadata: {
        type: 'reflection',
        scored: false,
      },
    };
  }
}
