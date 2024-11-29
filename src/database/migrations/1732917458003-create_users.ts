import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1732917458003 implements MigrationInterface {
  private emails = ['houston.diego@gmail.com', 'isis.irencio@gmail.com'];
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const email of this.emails) {
      queryRunner.query(
        `INSERT INTO "user" ("name", email, created_at) values ('', '${email}', NOW())`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const email of this.emails) {
      queryRunner.query(`DELETE  FROM "user" where "email" = '${email}'`);
    }
  }
}
