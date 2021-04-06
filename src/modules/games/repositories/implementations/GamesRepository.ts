import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .where("game.title ilike :title",{title: `%${param}%`})
      .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `
        SELECT COUNT(g.id) FROM games g 
      `
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[] | undefined> {
    const datas = await this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "games")
      .where("game.id = :id", {id})
      .getOne()

      return datas?.users;
      // Complete usando query builder
  }
}
