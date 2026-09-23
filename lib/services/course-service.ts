import { prisma } from "@/lib/db/client";
import type { SkillLevel } from "@prisma/client";

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  category: string;
  difficulty: SkillLevel;
  estimatedHours: number;
  isPublished: boolean;
  moduleCount: number;
  topicCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonSummary {
  id: string;
  topicId: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  orderIndex: number;
  isPublished: boolean;
  markdownBody: string;
  syntaxGuide: string | null;
  commonMistakes: string | null;
  practicalUseCases: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopicSummary {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  lessons: LessonSummary[];
  lesson?: LessonSummary | null;
}

export interface ModuleSummary {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  level: SkillLevel;
  topics: TopicSummary[];
}

export interface CourseDetail extends CourseSummary {
  modules: ModuleSummary[];
}

export interface TopicSeed {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  lessons?: LessonSummary[];
  lesson?: LessonSummary | null;
}

export interface ModuleSeed {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  level: SkillLevel;
  topics: TopicSeed[];
}

export interface CourseSeed extends CourseSummary {
  modules: ModuleSeed[];
}

export interface TopicDetail extends TopicSummary {
  module: {
    id: string;
    title: string;
    courseId: string;
    course: {
      id: string;
      title: string;
      slug: string;
      difficulty: SkillLevel;
      category: string;
    };
  };
  navigation: {
    prevTopic: { title: string; slug: string } | null;
    nextTopic: { title: string; slug: string } | null;
  };
}

// ---------------------------------------------------------------------------
// Realistic Development Seed Content
// ---------------------------------------------------------------------------

export const SEED_COURSES: CourseSeed[] = [
  {
    id: "course-java-core",
    title: "Java Programming & Object-Oriented Architecture",
    slug: "java",
    shortDescription: "Master fundamental syntax, memory model, control flow, and OOP design with hands-on examples.",
    description: "A comprehensive guide to Java application development. Starting from source code compilation and JVM memory layout to advanced encapsulation and modular class design. Engineered for students seeking rigorous software engineering foundations.",
    category: "Programming",
    difficulty: "BEGINNER",
    estimatedHours: 35,
    isPublished: true,
    moduleCount: 5,
    topicCount: 10,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
    modules: [
      {
        id: "mod-java-1",
        courseId: "course-java-core",
        title: "Module 1: Java Fundamentals",
        description: "Core execution environment, JVM architecture, primitive types, and syntax rules.",
        orderIndex: 1,
        level: "BEGINNER",
        topics: [
          {
            id: "top-java-intro",
            moduleId: "mod-java-1",
            title: "Introduction to Java & JVM Architecture",
            slug: "introduction",
            description: "Understand the Java compilation pipeline, bytecode verification, and write your first program.",
            orderIndex: 1,
            estimatedMinutes: 25,
            prerequisiteIds: [],
            lesson: {
              id: "les-java-intro",
              topicId: "top-java-intro",
              title: "Introduction to Java & JVM Architecture",
              slug: "introduction",
              summary: "Learn how Java achieves platform independence via bytecode and the Java Virtual Machine.",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### What is Java?

Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. The core design principle is **WORA** (Write Once, Run Anywhere).

### The Java Execution Pipeline

When you write Java code, it does not compile directly into native CPU machine instructions:

1. **Source Code (\`.java\`)**: Human-readable text written by the developer.
2. **Compiler (\`javac\`)**: Transforms Java source into standardized intermediate representation called **bytecode** (\`.class\` files).
3. **Java Virtual Machine (JVM)**: Executes bytecode on the target operating system using both interpretation and Just-In-Time (JIT) compilation.

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Welcome to StudentHub Java Course!");
    }
}
\`\`\`

### Dissecting the Code

- **\`public class HelloWorld\`**: Every executable line in Java must reside inside a class. The class name must match the filename (\`HelloWorld.java\`).
- **\`public static void main(String[] args)\`**: The runtime entry point.
  - \`public\`: Callable by the JVM runtime from outside the package.
  - \`static\`: Invoked without instantiating an object of the class.
  - \`void\`: Returns no value upon completion.
  - \`String[] args\`: Array of CLI arguments passed to the program.`,
              syntaxGuide: "javac HelloWorld.java\njava HelloWorld",
              commonMistakes: "Mismatched class name and filename. In Java, a public class named 'HelloWorld' must strictly be saved in 'HelloWorld.java'.",
              practicalUseCases: "Enterprise backend services, Android applications, high-throughput financial trading systems, distributed streaming pipelines.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
          {
            id: "top-java-variables",
            moduleId: "mod-java-1",
            title: "Variables and Primitive Data Types",
            slug: "variables",
            description: "Deep dive into 8 primitive types, stack vs heap allocation, and type conversion rules.",
            orderIndex: 2,
            estimatedMinutes: 30,
            prerequisiteIds: ["top-java-intro"],
            lessons: [
              {
                id: "les-java-variables",
                topicId: "top-java-variables",
                title: "1. Variables & Primitive Data Types",
                slug: "variables-primitives",
                summary: "Master Java's strongly typed memory system, 8 primitive types, and precision rules.",
                orderIndex: 1,
                isPublished: true,
                markdownBody: `### Java's Type System

Java is a **statically typed** language. Every variable must be declared with a data type before it can store values.

### The 8 Primitive Types

Java categorizes primitives into four groups:

1. **Integers**: \`byte\` (8-bit), \`short\` (16-bit), \`int\` (32-bit, default), \`long\` (64-bit, suffix \`L\`).
2. **Floating-point numbers**: \`float\` (32-bit IEEE 754, suffix \`F\`), \`double\` (64-bit, default).
3. **Characters**: \`char\` (16-bit Unicode character, single quotes \`'A'\`).
4. **Booleans**: \`boolean\` (\`true\` or \`false\`).

\`\`\`java
public class VariableBasics {
    public static void main(String[] args) {
        int studentId = 1042;
        double gpa = 3.85;
        char initial = 'M';
        boolean isEnrolled = true;

        System.out.println("Student ID: " + studentId);
        System.out.println("GPA: " + gpa);
        System.out.println("Enrolled: " + isEnrolled);
    }
}
\`\`\``,
                syntaxGuide: "int count = 10;\ndouble price = 19.99;",
                commonMistakes: "Floating-point precision issues when doing monetary calculations. Never use double for currency; use java.math.BigDecimal instead.",
                practicalUseCases: "Storing counters, timestamps, IDs, mathematical coordinates, and configuration flags.",
                createdAt: "2026-01-15T00:00:00.000Z",
                updatedAt: "2026-01-15T00:00:00.000Z",
              },
              {
                id: "les-java-var-scope",
                topicId: "top-java-variables",
                title: "2. Stack vs Heap Memory & Variable Scope",
                slug: "memory-scope",
                summary: "Understand how the JVM allocates primitive variables on the execution stack versus objects on the heap.",
                orderIndex: 2,
                isPublished: true,
                markdownBody: `### JVM Memory Architecture

When executing Java applications, runtime memory is partitioned into two core segments:

1. **Stack Memory**: Highly optimized, thread-isolated memory storing method invocation frames, local primitive variables, and references to heap objects.
2. **Heap Memory**: Shared across all threads, hosting instantiated objects and class metadata, automatically reclaimed by the Garbage Collector.

### Variable Scope Lifecycles

- **Block Scope**: Variables declared within \`{ ... }\` braces only exist during block execution.
- **Method Scope**: Local variables live within their respective method stack frame.
- **Instance Scope**: Fields reside in heap memory bound to the enclosing object lifecycle.

\`\`\`java
public class ScopeDemo {
    public static void main(String[] args) {
        int stackPrimitive = 42; // Stack allocation
        if (stackPrimitive > 0) {
            String heapRef = "StudentHub"; // Reference on stack, object on heap
            System.out.println(heapRef);
        }
        // heapRef is out of scope here
    }
}
\`\`\``,
                syntaxGuide: "int localVal = 100;\n// Local variables must be initialized before use",
                commonMistakes: "Attempting to access variables outside their enclosing curly brace block, or expecting local primitive variables to have default zero values.",
                practicalUseCases: "Optimizing memory footprint, managing thread safety, and preventing memory leaks in long-running services.",
                createdAt: "2026-01-15T00:00:00.000Z",
                updatedAt: "2026-01-15T00:00:00.000Z",
              },
              {
                id: "les-java-var-casting",
                topicId: "top-java-variables",
                title: "3. Type Conversion: Widening & Narrowing",
                slug: "type-conversion",
                summary: "Master automatic widening promotions and explicit narrowing type casts without numerical overflow.",
                orderIndex: 3,
                isPublished: true,
                markdownBody: `### Type Casting Rules in Java

Converting between compatible primitive types requires understanding widening and narrowing semantics.

### 1. Widening (Implicit / Automatic)
Moving from a narrower bit-width type to a broader bit-width type without data loss:
\`byte\` \u2192 \`short\` \u2192 \`int\` \u2192 \`long\` \u2192 \`float\` \u2192 \`double\`

\`\`\`java
int intVal = 100;
double doubleVal = intVal; // Automatic widening: 100.0
\`\`\`

### 2. Narrowing (Explicit / Manual)
Converting broader types to narrower types requires explicit parenthesis syntax and risks truncation or integer overflow:
\`double\` \u2192 \`float\` \u2192 \`long\` \u2192 \`int\` \u2192 \`short\` \u2192 \`byte\`

\`\`\`java
double price = 99.95;
int truncatedPrice = (int) price; // Explicit cast: 99 (fractional portion dropped)
\`\`\``,
                syntaxGuide: "int rounded = (int) Math.round(99.8);\nlong bigNum = 50000L;",
                commonMistakes: "Assuming narrowing casting rounds numbers (it truncates toward zero). Not checking for numerical overflow when casting long values exceeding Integer.MAX_VALUE into int.",
                practicalUseCases: "Interfacing with external binary protocols, processing audio signals, and scaling UI coordinates.",
                createdAt: "2026-01-15T00:00:00.000Z",
                updatedAt: "2026-01-15T00:00:00.000Z",
              },
            ],
          },
          {
            id: "top-java-operators",
            moduleId: "mod-java-1",
            title: "Operators and Expressions",
            slug: "operators",
            description: "Arithmetic, relational, logical short-circuiting, and ternary operations in Java.",
            orderIndex: 3,
            estimatedMinutes: 25,
            prerequisiteIds: ["top-java-variables"],
            lesson: {
              id: "les-java-operators",
              topicId: "top-java-operators",
              title: "Operators and Expressions",
              slug: "operators",
              summary: "Learn how Java evaluates expressions, precedence rules, and short-circuit boolean logic.",
              orderIndex: 3,
              isPublished: true,
              markdownBody: `### Operators in Java

Operators are special symbols used to perform operations on variables and values.

### Categories

- **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulus).
- **Relational**: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.
- **Logical**: \`&&\` (short-circuit AND), \`||\` (short-circuit OR), \`!\` (NOT).
- **Ternary**: \`condition ? expressionIfTrue : expressionIfFalse\`.

\`\`\`java
public class OperatorDemo {
    public static void main(String[] args) {
        int score = 85;
        boolean passed = score >= 60;
        String status = passed ? "Pass" : "Remedial";

        // Short-circuit check
        String name = null;
        if (name != null && name.length() > 0) {
            System.out.println("Valid name");
        }
    }
}
\`\`\``,
              syntaxGuide: "boolean result = (a > b) && (c != 0);",
              commonMistakes: "Using single & or | instead of && or ||. Single & executes both sides without short-circuiting, risking NullPointerException.",
              practicalUseCases: "Validation logic, scoring algorithms, access permission evaluation.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
        ],
      },
      {
        id: "mod-java-2",
        courseId: "course-java-core",
        title: "Module 2: Control Flow",
        description: "Branching conditions, switch expressions, and loop execution control.",
        orderIndex: 2,
        level: "BEGINNER",
        topics: [
          {
            id: "top-java-conditions",
            moduleId: "mod-java-2",
            title: "Conditional Statements & Switch",
            slug: "conditions",
            description: "Execute alternative logic paths using if-else branches and enhanced switch syntax.",
            orderIndex: 1,
            estimatedMinutes: 30,
            prerequisiteIds: ["top-java-operators"],
            lesson: {
              id: "les-java-conditions",
              topicId: "top-java-conditions",
              title: "Conditional Statements & Switch",
              slug: "conditions",
              summary: "Structured decision-making using if, else if, and modern switch statements.",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### Decision Making in Java

Control flow statements alter the execution path based on runtime conditions.

\`\`\`java
public class ConditionsDemo {
    public static void main(String[] args) {
        int grade = 88;

        if (grade >= 90) {
            System.out.println("Grade: A");
        } else if (grade >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C or below");
        }
    }
}
\`\`\`

### Switch Expressions

Modern Java supports clean arrow syntax in switch blocks that eliminate unintentional fallthrough:

\`\`\`java
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Invalid day";
};
\`\`\``,
              syntaxGuide: "if (condition) { ... } else if (other) { ... } else { ... }",
              commonMistakes: "Comparing strings with '==' instead of '.equals()'. '==' checks reference identity, while '.equals()' compares actual string character sequences.",
              practicalUseCases: "Route dispatching, input validation, role-based authorization branching.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
          {
            id: "top-java-loops",
            moduleId: "mod-java-2",
            title: "Loops and Iteration",
            slug: "loops",
            description: "Master for, while, do-while loops, and termination control with break and continue.",
            orderIndex: 2,
            estimatedMinutes: 30,
            prerequisiteIds: ["top-java-conditions"],
            lesson: {
              id: "les-java-loops",
              topicId: "top-java-loops",
              title: "Loops and Iteration",
              slug: "loops",
              summary: "Master iterative computation, collection traversal, and loop control semantics.",
              orderIndex: 2,
              isPublished: true,
              markdownBody: `### Loop Structures

Java provides three primary loop mechanisms for repetitive execution:

1. **\`for\` loop**: Ideal when iteration count is known in advance.
2. **\`while\` loop**: Evaluates condition before each iteration.
3. **\`do-while\` loop**: Executes at least once before checking condition.

\`\`\`java
public class LoopsDemo {
    public static void main(String[] args) {
        // Standard counted loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Step " + i);
        }

        // Sentinel while loop
        int remaining = 3;
        while (remaining > 0) {
            System.out.println("Countdown: " + remaining);
            remaining--;
        }
    }
}
\`\`\``,
              syntaxGuide: "for (int i = 0; i < n; i++) { ... }",
              commonMistakes: "Off-by-one errors in loop boundaries (e.g. i <= length instead of i < length).",
              practicalUseCases: "Processing streaming buffers, iterating search results, calculating batch metrics.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
        ],
      },
      {
        id: "mod-java-3",
        courseId: "course-java-core",
        title: "Module 3: Methods & Modular Design",
        description: "Decompose complex logic into reusable, testable method components.",
        orderIndex: 3,
        level: "INTERMEDIATE",
        topics: [
          {
            id: "top-java-methods",
            moduleId: "mod-java-3",
            title: "Method Definition, Overloading & Scope",
            slug: "methods",
            description: "Signature rules, return semantics, pass-by-value in Java, and method overloading.",
            orderIndex: 1,
            estimatedMinutes: 35,
            prerequisiteIds: ["top-java-loops"],
            lesson: {
              id: "les-java-methods",
              topicId: "top-java-methods",
              title: "Method Definition, Overloading & Scope",
              slug: "methods",
              summary: "Learn how Java packages functions, handles pass-by-value, and resolves overloaded signatures.",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### Methods in Java

A method is a block of code that only runs when called. Methods enable code reuse and modular separation of concerns.

\`\`\`java
public class Calculator {
    // Overloaded add method for two integers
    public static int add(int a, int b) {
        return a + b;
    }

    // Overloaded add method for three integers
    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    public static void main(String[] args) {
        System.out.println("Sum: " + add(10, 20));
        System.out.println("Sum 3: " + add(5, 15, 25));
    }
}
\`\`\`

### Pass-By-Value Principle

**Java is strictly pass-by-value.** When a variable is passed into a method:
- For primitives: a copy of the actual value is passed. Changes inside do not affect the caller.
- For object references: a copy of the memory address is passed. Mutating object fields changes the object, but reassigning the reference variable does not affect the caller.`,
              syntaxGuide: "public static ReturnType methodName(Type param1, Type param2) { ... }",
              commonMistakes: "Expecting a method to reassign the caller's object reference. Only internal object properties mutate when reference is passed.",
              practicalUseCases: "Utility algorithms, mathematical formulas, business rules verification.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
        ],
      },
      {
        id: "mod-java-4",
        courseId: "course-java-core",
        title: "Module 4: Arrays & Data Collections",
        description: "Fixed-size homogeneous sequences, multi-dimensional structures, and memory bounds.",
        orderIndex: 4,
        level: "INTERMEDIATE",
        topics: [
          {
            id: "top-java-arrays",
            moduleId: "mod-java-4",
            title: "Arrays & Multidimensional Storage",
            slug: "arrays",
            description: "Index indexing, linear array allocation, length property, and multidimensional arrays.",
            orderIndex: 1,
            estimatedMinutes: 30,
            prerequisiteIds: ["top-java-methods"],
            lesson: {
              id: "les-java-arrays",
              topicId: "top-java-arrays",
              title: "Arrays & Multidimensional Storage",
              slug: "arrays",
              summary: "Deep dive into array indexing, bounds checking, and matrix representations.",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### What is an Array?

An array in Java is a container object that holds a fixed number of values of a single type. Array length is established when created and cannot change.

\`\`\`java
public class ArrayExample {
    public static void main(String[] args) {
        int[] scores = new int[4];
        scores[0] = 95;
        scores[1] = 88;
        scores[2] = 72;
        scores[3] = 91;

        // Enhanced for-each traversal
        int total = 0;
        for (int score : scores) {
            total += score;
        }

        double average = (double) total / scores.length;
        System.out.println("Average Score: " + average);
    }
}
\`\`\``,
              syntaxGuide: "int[] numbers = new int[]{ 1, 2, 3, 4, 5 };",
              commonMistakes: "ArrayIndexOutOfBoundsException by attempting to access index equal to array.length.",
              practicalUseCases: "Pixel buffers, geometric coordinates, lookup tables, algorithmic sorting arrays.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
        ],
      },
      {
        id: "mod-java-5",
        courseId: "course-java-core",
        title: "Module 5: Object-Oriented Architecture",
        description: "Classes, instantiations, encapsulation, state preservation, and data protection.",
        orderIndex: 5,
        level: "ADVANCED",
        topics: [
          {
            id: "top-java-classes",
            moduleId: "mod-java-5",
            title: "Classes, Objects & Constructors",
            slug: "classes-and-objects",
            description: "Model real-world entities into stateful software components with constructors.",
            orderIndex: 1,
            estimatedMinutes: 40,
            prerequisiteIds: ["top-java-arrays"],
            lesson: {
              id: "les-java-classes",
              topicId: "top-java-classes",
              title: "Classes, Objects & Constructors",
              slug: "classes-and-objects",
              summary: "Learn how to define blueprints (classes) and instantiate runtime entities (objects).",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### Classes vs Objects

- A **class** is a blueprint from which individual objects are created.
- An **object** is an instance of a class, possessing identity, state, and behavior.

\`\`\`java
public class Student {
    String name;
    int credits;

    // Parameterized constructor
    public Student(String name, int credits) {
        this.name = name;
        this.credits = credits;
    }

    public void addCredits(int count) {
        this.credits += count;
    }

    public void displayStatus() {
        System.out.println(name + " has " + credits + " credits.");
    }
}
\`\`\``,
              syntaxGuide: "Student student = new Student(\"Alex\", 16);",
              commonMistakes: "Forgetting to initialize fields or assuming default constructors exist after declaring a custom constructor.",
              practicalUseCases: "Entity modeling in web servers, database record representation, stateful services.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
          {
            id: "top-java-encapsulation",
            moduleId: "mod-java-5",
            title: "Encapsulation & Access Modifiers",
            slug: "encapsulation",
            description: "Protect object integrity using private fields, accessors, mutators, and invariants.",
            orderIndex: 2,
            estimatedMinutes: 35,
            prerequisiteIds: ["top-java-classes"],
            lesson: {
              id: "les-java-encapsulation",
              topicId: "top-java-encapsulation",
              title: "Encapsulation & Access Modifiers",
              slug: "encapsulation",
              summary: "Master data hiding, field protection, and defensive copying in Java classes.",
              orderIndex: 2,
              isPublished: true,
              markdownBody: `### The Principle of Encapsulation

Encapsulation bundles data (fields) and methods that operate on the data into a single unit, hiding internal representation from direct outside interference.

### Access Modifiers

1. **\`private\`**: Accessible only within the declaring class.
2. **\`default\` (package-private)**: Accessible within the same package.
3. **\`protected\`**: Accessible within the package and by subclasses.
4. **\`public\`**: Accessible from anywhere in the classpath.

\`\`\`java
public class BankAccount {
    private double balance;

    public BankAccount(double initialDeposit) {
        if (initialDeposit > 0) {
            this.balance = initialDeposit;
        }
    }

    public double getBalance() {
        return this.balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        this.balance += amount;
    }
}
\`\`\``,
              syntaxGuide: "private double balance;\npublic double getBalance() { return balance; }",
              commonMistakes: "Making fields public to avoid writing getters and setters, breaking invariant validation.",
              practicalUseCases: "Securing financial accounts, enforcing password rules, maintaining caching state.",
              createdAt: "2026-01-15T00:00:00.000Z",
              updatedAt: "2026-01-15T00:00:00.000Z",
            },
          },
        ],
      },
    ],
  },
  {
    id: "course-python-core",
    title: "Python Systems & Algorithmic Foundations",
    slug: "python",
    shortDescription: "Explore idiomatic Python, data structures, and functional patterns from scratch.",
    description: "Designed for modern developers seeking clarity and algorithmic agility. Covers dynamic typing, list comprehensions, dictionary indexing, and modular script development.",
    category: "Programming",
    difficulty: "BEGINNER",
    estimatedHours: 25,
    isPublished: true,
    moduleCount: 1,
    topicCount: 2,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-02-05T00:00:00.000Z",
    modules: [
      {
        id: "mod-py-1",
        courseId: "course-python-core",
        title: "Module 1: Python Fundamentals",
        description: "Variables, dynamic typing, list structures, and syntax rules.",
        orderIndex: 1,
        level: "BEGINNER",
        topics: [
          {
            id: "top-py-intro",
            moduleId: "mod-py-1",
            title: "Dynamic Typing and Scripting",
            slug: "dynamic-typing",
            description: "Understand Python's interpreted runtime, variables, and type hints.",
            orderIndex: 1,
            estimatedMinutes: 20,
            prerequisiteIds: [],
            lesson: {
              id: "les-py-intro",
              topicId: "top-py-intro",
              title: "Dynamic Typing and Scripting",
              slug: "dynamic-typing",
              summary: "Learn how Python handles memory references and dynamic types.",
              orderIndex: 1,
              isPublished: true,
              markdownBody: `### Python's Dynamic Nature

In Python, variables are labels bound to objects in memory. You do not declare variable types explicitly.

\`\`\`python
# Simple variable assignment
count = 42
temperature = 98.6
course_name = "Python Foundations"

print(f"{course_name} has {count} exercises.")
\`\`\`

Python 3 also supports optional type annotations for clarity:
\`\`\`python
def calculate_area(width: float, height: float) -> float:
    return width * height
\`\`\``,
              syntaxGuide: "def function_name(param: type) -> return_type:",
              commonMistakes: "Relying on implicit type conversion; Python does not automatically coerce integers to strings during concatenation.",
              practicalUseCases: "Data analysis, machine learning pipelines, automation scripting, rapid API prototyping.",
              createdAt: "2026-01-20T00:00:00.000Z",
              updatedAt: "2026-01-20T00:00:00.000Z",
            },
          },
          {
            id: "top-py-lists",
            moduleId: "mod-py-1",
            title: "Lists and Comprehensions",
            slug: "lists-and-comprehensions",
            description: "Perform fast list transformations using idiomatic list comprehensions.",
            orderIndex: 2,
            estimatedMinutes: 25,
            prerequisiteIds: ["top-py-intro"],
            lesson: {
              id: "les-py-lists",
              topicId: "top-py-lists",
              title: "Lists and Comprehensions",
              slug: "lists-and-comprehensions",
              summary: "Learn how to manipulate ordered sequences and construct expressive list comprehensions.",
              orderIndex: 2,
              isPublished: true,
              markdownBody: `### Python Lists

Lists are mutable, ordered sequences in Python.

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]

# Idiomatic list comprehension
even_squares = [x ** 2 for x in numbers if x % 2 == 0]
print(even_squares)  # [4, 16, 36]
\`\`\``,
              syntaxGuide: "[expression for item in iterable if condition]",
              commonMistakes: "Modifying a list while iterating over it, causing skipped elements.",
              practicalUseCases: "Transforming dataset rows, filtering API responses, data cleansing.",
              createdAt: "2026-01-20T00:00:00.000Z",
              updatedAt: "2026-01-20T00:00:00.000Z",
            },
          },
        ],
      },
    ],
  },
  {
    id: "course-distributed-draft",
    title: "Distributed Systems Architecture",
    slug: "distributed-systems",
    shortDescription: "Draft curriculum for consensus protocols, Raft, and distributed caches.",
    description: "Internal draft content. Must remain hidden from public catalog and unauthenticated requests.",
    category: "Architecture",
    difficulty: "ADVANCED",
    estimatedHours: 40,
    isPublished: false, // DRAFT: MUST NEVER LEAK TO PUBLIC CATALOG
    moduleCount: 1,
    topicCount: 1,
    createdAt: "2026-02-10T00:00:00.000Z",
    updatedAt: "2026-02-10T00:00:00.000Z",
    modules: [
      {
        id: "mod-dist-1",
        courseId: "course-distributed-draft",
        title: "Module 1: Consensus",
        description: "Raft and Paxos internals.",
        orderIndex: 1,
        level: "ADVANCED",
        topics: [
          {
            id: "top-dist-raft",
            moduleId: "mod-dist-1",
            title: "The Raft Protocol",
            slug: "raft-protocol",
            description: "Leader election and log replication.",
            orderIndex: 1,
            estimatedMinutes: 45,
            prerequisiteIds: [],
            lesson: {
              id: "les-dist-raft",
              topicId: "top-dist-raft",
              title: "The Raft Protocol",
              slug: "raft-protocol",
              summary: "Leader election, log replication, and safety invariants in Raft consensus.",
              orderIndex: 1,
              isPublished: false,
              markdownBody: "### Draft Content\n\nThis lesson is currently under review by content moderators.",
              syntaxGuide: null,
              commonMistakes: null,
              practicalUseCases: null,
              createdAt: "2026-02-10T00:00:00.000Z",
              updatedAt: "2026-02-10T00:00:00.000Z",
            },
          },
        ],
      },
    ],
  },
];

// Global in-memory map for dev/test fallback
declare global {
  // eslint-disable-next-line no-var
  var __studenthub_dev_courses__: Map<string, CourseDetail> | undefined;
}

const devCourses = globalThis.__studenthub_dev_courses__ ?? new Map<string, CourseDetail>();

function populateDevCourses(): void {
  for (const c of SEED_COURSES) {
    const modules: ModuleSummary[] = c.modules.map((m) => ({
      ...m,
      topics: m.topics.map((t) => {
        const rawLessons = t.lessons && t.lessons.length > 0
          ? [...t.lessons]
          : t.lesson ? [{ ...t.lesson }] : [];
        rawLessons.sort((a, b) => a.orderIndex - b.orderIndex);
        return {
          ...t,
          lessons: rawLessons,
          lesson: rawLessons[0] || null,
        };
      }),
    }));

    devCourses.set(c.slug, {
      ...c,
      modules,
    });
  }
}

if (process.env.NODE_ENV !== "production") {
  globalThis.__studenthub_dev_courses__ = devCourses;
  if (devCourses.size === 0) {
    populateDevCourses();
  }
}

let dbCoursesSeeded = false;

/**
 * Ensures seed courses exist in PostgreSQL when DATABASE_URL is provided.
 */
export async function ensureCoursesInDb(): Promise<void> {
  if (!process.env.DATABASE_URL || dbCoursesSeeded) return;

  try {
    for (const course of SEED_COURSES) {
      await prisma.course.upsert({
        where: { slug: course.slug },
        update: {
          title: course.title,
          description: course.description,
          shortDescription: course.shortDescription,
          category: course.category,
          difficulty: course.difficulty,
          estimatedHours: course.estimatedHours,
          isPublished: course.isPublished,
        },
        create: {
          id: course.id,
          title: course.title,
          slug: course.slug,
          shortDescription: course.shortDescription,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
          estimatedHours: course.estimatedHours,
          isPublished: course.isPublished,
        },
      });

      for (const mod of course.modules) {
        await prisma.module.upsert({
          where: { id: mod.id },
          update: {
            title: mod.title,
            description: mod.description,
            orderIndex: mod.orderIndex,
            level: mod.level,
          },
          create: {
            id: mod.id,
            courseId: course.id,
            title: mod.title,
            description: mod.description,
            orderIndex: mod.orderIndex,
            level: mod.level,
          },
        });

        for (const top of mod.topics) {
          await prisma.topic.upsert({
            where: { slug: top.slug },
            update: {
              title: top.title,
              description: top.description,
              orderIndex: top.orderIndex,
              estimatedMinutes: top.estimatedMinutes,
              prerequisiteIds: top.prerequisiteIds,
            },
            create: {
              id: top.id,
              moduleId: mod.id,
              title: top.title,
              slug: top.slug,
              description: top.description,
              orderIndex: top.orderIndex,
              estimatedMinutes: top.estimatedMinutes,
              prerequisiteIds: top.prerequisiteIds,
            },
          });

          const lessonsToSeed = top.lessons && top.lessons.length > 0
            ? top.lessons
            : top.lesson ? [top.lesson] : [];

          for (const les of lessonsToSeed) {
            await prisma.lesson.upsert({
              where: { id: les.id },
              update: {
                topicId: top.id,
                title: les.title,
                slug: les.slug,
                summary: les.summary,
                orderIndex: les.orderIndex,
                isPublished: les.isPublished,
                markdownBody: les.markdownBody,
                syntaxGuide: les.syntaxGuide,
                commonMistakes: les.commonMistakes,
                practicalUseCases: les.practicalUseCases,
              },
              create: {
                id: les.id,
                topicId: top.id,
                title: les.title,
                slug: les.slug,
                summary: les.summary,
                orderIndex: les.orderIndex,
                isPublished: les.isPublished,
                markdownBody: les.markdownBody,
                syntaxGuide: les.syntaxGuide,
                commonMistakes: les.commonMistakes,
                practicalUseCases: les.practicalUseCases,
              },
            });
          }
        }
      }
    }
    dbCoursesSeeded = true;
  } catch (err) {
    console.warn("Could not seed courses to database:", err);
  }
}

/**
 * List published courses with pagination and filtering.
 * Never returns draft or archived courses unless privileged.
 */
export async function listPublishedCourses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  level?: SkillLevel;
}): Promise<{
  courses: CourseSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const page = Math.max(1, params?.page || 1);
  const limit = Math.min(50, Math.max(1, params?.limit || 20));

  if (process.env.DATABASE_URL) {
    try {
      await ensureCoursesInDb();

      const where = {
        isPublished: true,
        ...(params?.category ? { category: { equals: params.category, mode: "insensitive" as const } } : {}),
        ...(params?.level ? { difficulty: params.level } : {}),
      };

      const [total, records] = await Promise.all([
        prisma.course.count({ where }),
        prisma.course.findMany({
          where,
          include: {
            modules: {
              include: {
                topics: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const courses: CourseSummary[] = records.map((c) => {
        let topicCount = 0;
        for (const m of c.modules) {
          topicCount += m.topics.length;
        }
        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          shortDescription: c.shortDescription,
          description: c.description,
          category: c.category,
          difficulty: c.difficulty,
          estimatedHours: c.estimatedHours,
          isPublished: c.isPublished,
          moduleCount: c.modules.length,
          topicCount,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        };
      });

      return {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production listPublishedCourses database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma listPublishedCourses error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Development/Test fallback
  let list = Array.from(devCourses.values()).filter((c) => c.isPublished);

  if (params?.category) {
    list = list.filter((c) => c.category.toLowerCase() === params.category?.toLowerCase());
  }

  if (params?.level) {
    list = list.filter((c) => c.difficulty === params.level);
  }

  const total = list.length;
  const skip = (page - 1) * limit;
  const paged = list.slice(skip, skip + limit);

  const courses: CourseSummary[] = paged.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    shortDescription: c.shortDescription,
    description: c.description,
    category: c.category,
    difficulty: c.difficulty,
    estimatedHours: c.estimatedHours,
    isPublished: c.isPublished,
    moduleCount: c.modules.length,
    topicCount: c.modules.reduce((sum, m) => sum + m.topics.length, 0),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Retrieve a single published course with full curriculum structure by its slug.
 * Returns null if not found or if the course is unpublished.
 */
export async function getPublishedCourseBySlug(
  slug: string,
  isPrivileged = false
): Promise<CourseDetail | null> {
  if (!slug) return null;

  if (process.env.DATABASE_URL) {
    try {
      await ensureCoursesInDb();

      const record = await prisma.course.findUnique({
        where: { slug },
        include: {
          modules: {
            orderBy: { orderIndex: "asc" },
            include: {
              topics: {
                orderBy: { orderIndex: "asc" },
                include: {
                  lessons: {
                    where: isPrivileged ? undefined : { isPublished: true },
                    orderBy: { orderIndex: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!record) return null;
      if (!record.isPublished && !isPrivileged) return null;

      let topicCount = 0;
      const modules: ModuleSummary[] = record.modules.map((m) => {
        topicCount += m.topics.length;
        const topics: TopicSummary[] = m.topics.map((t) => {
          const lessons: LessonSummary[] = (t.lessons || []).map((l) => ({
            id: l.id,
            topicId: l.topicId,
            title: l.title,
            slug: l.slug,
            summary: l.summary,
            orderIndex: l.orderIndex,
            isPublished: l.isPublished,
            markdownBody: l.markdownBody,
            syntaxGuide: l.syntaxGuide,
            commonMistakes: l.commonMistakes,
            practicalUseCases: l.practicalUseCases,
            createdAt: l.createdAt.toISOString(),
            updatedAt: l.updatedAt.toISOString(),
          }));

          return {
            id: t.id,
            moduleId: t.moduleId,
            title: t.title,
            slug: t.slug,
            description: t.description,
            orderIndex: t.orderIndex,
            estimatedMinutes: t.estimatedMinutes,
            prerequisiteIds: t.prerequisiteIds,
            lessons,
            lesson: lessons[0] || null,
          };
        });

        return {
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          description: m.description,
          orderIndex: m.orderIndex,
          level: m.level,
          topics,
        };
      });

      return {
        id: record.id,
        title: record.title,
        slug: record.slug,
        shortDescription: record.shortDescription,
        description: record.description,
        category: record.category,
        difficulty: record.difficulty,
        estimatedHours: record.estimatedHours,
        isPublished: record.isPublished,
        moduleCount: record.modules.length,
        topicCount,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
        modules,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        console.error("Production getPublishedCourseBySlug database error:", err);
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getPublishedCourseBySlug error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  // Development/Test fallback
  const course = devCourses.get(slug);
  if (!course) return null;
  if (!course.isPublished && !isPrivileged) return null;

  return {
    ...course,
    modules: course.modules.map((m) => ({
      ...m,
      topics: m.topics.map((t) => {
        const filteredLessons = (t.lessons || []).filter((l) => l.isPublished || isPrivileged);
        return {
          ...t,
          lessons: filteredLessons,
          lesson: filteredLessons[0] || null,
        };
      }),
    })),
  };
}

/**
 * Retrieve a specific topic and its lesson(s) by course slug and topic slug.
 * Computes previous/next topic navigation for the complete curriculum.
 * Optionally selects a specific lesson within the topic by ID or slug.
 */
export async function getTopicBySlugs(
  courseSlug: string,
  topicSlug: string,
  isPrivileged = false,
  activeLessonIdOrSlug?: string
): Promise<TopicDetail | null> {
  const course = await getPublishedCourseBySlug(courseSlug, isPrivileged);
  if (!course) return null;

  // Flatten topics in ordered sequence across modules
  const orderedTopics: Array<{
    topic: TopicSummary;
    module: ModuleSummary;
  }> = [];

  for (const mod of course.modules) {
    for (const top of mod.topics) {
      orderedTopics.push({ topic: top, module: mod });
    }
  }

  const currentIndex = orderedTopics.findIndex((item) => item.topic.slug === topicSlug);
  if (currentIndex === -1) return null;

  const current = orderedTopics[currentIndex];

  // Filter lessons for published status unless privileged
  const publishedLessons = (current.topic.lessons || []).filter(
    (l) => l.isPublished || isPrivileged
  );

  let activeLesson: LessonSummary | null = null;
  if (publishedLessons.length > 0) {
    if (activeLessonIdOrSlug) {
      activeLesson =
        publishedLessons.find(
          (l) => l.id === activeLessonIdOrSlug || l.slug === activeLessonIdOrSlug
        ) || publishedLessons[0] || null;
    } else {
      activeLesson = publishedLessons[0] || null;
    }
  }

  const prevItem = currentIndex > 0 ? orderedTopics[currentIndex - 1] : null;
  const nextItem = currentIndex < orderedTopics.length - 1 ? orderedTopics[currentIndex + 1] : null;

  return {
    ...current.topic,
    lessons: publishedLessons,
    lesson: activeLesson,
    module: {
      id: current.module.id,
      title: current.module.title,
      courseId: course.id,
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        difficulty: course.difficulty,
        category: course.category,
      },
    },
    navigation: {
      prevTopic: prevItem
        ? { title: prevItem.topic.title, slug: prevItem.topic.slug }
        : null,
      nextTopic: nextItem
        ? { title: nextItem.topic.title, slug: nextItem.topic.slug }
        : null,
    },
  };
}

/**
 * Retrieve a single module by ID (for API access).
 */
export async function getModuleById(moduleId: string): Promise<ModuleSummary | null> {
  if (!moduleId) return null;

  if (process.env.DATABASE_URL) {
    try {
      await ensureCoursesInDb();

      const record = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
          topics: {
            orderBy: { orderIndex: "asc" },
            include: {
              lessons: {
                where: { isPublished: true },
                orderBy: { orderIndex: "asc" },
              },
            },
          },
          course: true,
        },
      });

      if (!record || !record.course.isPublished) return null;

      return {
        id: record.id,
        courseId: record.courseId,
        title: record.title,
        description: record.description,
        orderIndex: record.orderIndex,
        level: record.level,
        topics: record.topics.map((t) => {
          const lessons: LessonSummary[] = (t.lessons || []).map((l) => ({
            id: l.id,
            topicId: l.topicId,
            title: l.title,
            slug: l.slug,
            summary: l.summary,
            orderIndex: l.orderIndex,
            isPublished: l.isPublished,
            markdownBody: l.markdownBody,
            syntaxGuide: l.syntaxGuide,
            commonMistakes: l.commonMistakes,
            practicalUseCases: l.practicalUseCases,
            createdAt: l.createdAt.toISOString(),
            updatedAt: l.updatedAt.toISOString(),
          }));

          return {
            id: t.id,
            moduleId: t.moduleId,
            title: t.title,
            slug: t.slug,
            description: t.description,
            orderIndex: t.orderIndex,
            estimatedMinutes: t.estimatedMinutes,
            prerequisiteIds: t.prerequisiteIds,
            lessons,
            lesson: lessons[0] || null,
          };
        }),
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getModuleById error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  for (const c of devCourses.values()) {
    if (!c.isPublished) continue;
    const found = c.modules.find((m) => m.id === moduleId);
    if (found) {
      return {
        ...found,
        topics: found.topics.map((t) => {
          const pubLessons = (t.lessons || []).filter((l) => l.isPublished);
          return {
            ...t,
            lessons: pubLessons,
            lesson: pubLessons[0] || null,
          };
        }),
      };
    }
  }

  return null;
}

/**
 * Retrieve a topic by its ID or slug independently.
 */
export async function getTopicByIdOrSlug(identifier: string): Promise<TopicSummary | null> {
  if (!identifier) return null;

  if (process.env.DATABASE_URL) {
    try {
      await ensureCoursesInDb();

      const record = await prisma.topic.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { orderIndex: "asc" },
          },
          module: {
            include: { course: true },
          },
        },
      });

      if (!record || !record.module.course.isPublished) return null;

      const lessons: LessonSummary[] = (record.lessons || []).map((l) => ({
        id: l.id,
        topicId: l.topicId,
        title: l.title,
        slug: l.slug,
        summary: l.summary,
        orderIndex: l.orderIndex,
        isPublished: l.isPublished,
        markdownBody: l.markdownBody,
        syntaxGuide: l.syntaxGuide,
        commonMistakes: l.commonMistakes,
        practicalUseCases: l.practicalUseCases,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }));

      return {
        id: record.id,
        moduleId: record.moduleId,
        title: record.title,
        slug: record.slug,
        description: record.description,
        orderIndex: record.orderIndex,
        estimatedMinutes: record.estimatedMinutes,
        prerequisiteIds: record.prerequisiteIds,
        lessons,
        lesson: lessons[0] || null,
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getTopicByIdOrSlug error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  for (const c of devCourses.values()) {
    if (!c.isPublished) continue;
    for (const m of c.modules) {
      for (const t of m.topics) {
        if (t.id === identifier || t.slug === identifier) {
          const pubLessons = (t.lessons || []).filter((l) => l.isPublished);
          return {
            ...t,
            lessons: pubLessons,
            lesson: pubLessons[0] || null,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Retrieve a lesson by its ID.
 */
export async function getLessonById(lessonId: string): Promise<LessonSummary | null> {
  if (!lessonId) return null;

  if (process.env.DATABASE_URL) {
    try {
      await ensureCoursesInDb();

      const record = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          topic: {
            include: {
              module: {
                include: { course: true },
              },
            },
          },
        },
      });

      if (!record || !record.isPublished || !record.topic.module.course.isPublished) {
        return null;
      }

      return {
        id: record.id,
        topicId: record.topicId,
        title: record.title,
        slug: record.slug,
        summary: record.summary,
        orderIndex: record.orderIndex,
        isPublished: record.isPublished,
        markdownBody: record.markdownBody,
        syntaxGuide: record.syntaxGuide,
        commonMistakes: record.commonMistakes,
        practicalUseCases: record.practicalUseCases,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      };
    } catch (err) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Database service unavailable.");
      }
      console.warn("Prisma getLessonById error, falling back to memory:", err);
    }
  }

  // Ensure production never falls back to in-memory store
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database configuration required in production.");
  }

  for (const c of devCourses.values()) {
    if (!c.isPublished) continue;
    for (const m of c.modules) {
      for (const t of m.topics) {
        if (t.lessons) {
          const found = t.lessons.find((l) => l.id === lessonId && l.isPublished);
          if (found) return found;
        }
        if (t.lesson && t.lesson.id === lessonId && t.lesson.isPublished) {
          return t.lesson;
        }
      }
    }
  }

  return null;
}

/**
 * Test helper for inserting mock lessons into devCourses.
 */
export function addDevLesson(lesson: LessonSummary): void {
  for (const c of devCourses.values()) {
    for (const m of c.modules) {
      for (const t of m.topics) {
        if (t.id === lesson.topicId) {
          t.lessons = t.lessons || [];
          t.lessons.push(lesson);
          t.lessons.sort((a, b) => a.orderIndex - b.orderIndex);
          t.lesson = t.lessons[0] || null;
          return;
        }
      }
    }
  }
}
