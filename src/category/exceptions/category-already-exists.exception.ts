export class CategoryAlreadyExistsException extends Error {
  constructor(public readonly name: string) {
    super(`Category ${name} already exists`);
  }
}
