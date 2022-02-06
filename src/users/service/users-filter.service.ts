import { Injectable } from '@nestjs/common';
import { SearchUserParams } from 'src/users/service/i-users.service';

@Injectable()
export class UsersFilterService {
  createUserListFilter(searchParams: SearchUserParams) {
    const { limit, offset } = searchParams;
    const filterParamName = ['email', 'name', 'contactPhone'];
    const filter = {};
    Object.keys(searchParams).map((key: string) => {
      if (filter[key] !== '') {
        if (filterParamName.includes(key)) {
          filter[key] = {
            $regex: new RegExp(searchParams[key]),
            $options: 'i',
          };
        }
      }
    });
    return {
      filter,
      limit,
      offset,
    };
  }
}
