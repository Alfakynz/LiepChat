import fs from 'fs/promises'

const USERS_PATH = '../db/users.json'

export async function readUsers() {
  const data = await fs.readFile(USERS_PATH, 'utf-8')
  return JSON.parse(data)
}

export async function writeUsers(users: any[]) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2))
}
