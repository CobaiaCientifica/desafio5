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
      .createQueryBuilder("games")
        // .select(["games.id","games.title","games.created_at","games.updated_at"])
        .where("games.title ILIKE :title", {title: "%"+param+"%"})
        .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(games.id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
        .leftJoinAndSelect("games.users","users")
        .select(["first_name","last_name","email"])
        .where("games.id = :gameId", {gameId:id})
        .getRawMany();
      // Complete usando query builder
  }
}
