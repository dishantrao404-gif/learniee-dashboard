import fs from "fs";
import path from "path";
import { Course, User } from "./types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const COURSES_FILE = path.join(DATA_DIR, "courses.json");

function ensureDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    const seedUsers = path.join(SEED_DIR, "users.json");
    fs.writeFileSync(
      USERS_FILE,
      fs.existsSync(seedUsers) ? fs.readFileSync(seedUsers, "utf-8") : "[]"
    );
  }
  if (!fs.existsSync(COURSES_FILE)) {
    const seedCourses = path.join(SEED_DIR, "courses.json");
    fs.writeFileSync(COURSES_FILE, fs.readFileSync(seedCourses, "utf-8"));
  }
}

function readJson<T>(file: string): T {
  ensureDataFiles();
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson<T>(file: string, data: T): void {
  ensureDataFiles();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

export function getUsers(): User[] {
  return readJson<User[]>(USERS_FILE);
}

export function saveUsers(users: User[]): void {
  writeJson(USERS_FILE, users);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function getCourses(): Course[] {
  return readJson<Course[]>(COURSES_FILE);
}
