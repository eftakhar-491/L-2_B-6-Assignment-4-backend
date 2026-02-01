import { prisma as db } from "../lib/prisma";
import { excludeField } from "../constants";

type QueryParams = Record<string, string | undefined>;

export class QueryBuilder<TWhere, TSelect, TOrderBy> {
  private query: QueryParams;

  private where: TWhere | any = {};
  private select?: TSelect;
  private orderBy?: TOrderBy;
  private skip?: number;
  private take?: number;

  constructor(query: QueryParams) {
    this.query = query;
  }

  /** ---------------- FILTER ---------------- */
  filter(): this {
    const filter: Record<string, any> = { ...this.query };

    excludeField.forEach((field) => delete filter[field]);

    // Convert operators like gt, gte, lt, lte
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        this.where[key] = filter[key];
      }
    });

    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm;

    if (!searchTerm) return this;

    this.where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "createdAt";

    const fields = sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return { [field.substring(1)]: "desc" };
      }
      return { [field]: "asc" };
    });

    this.orderBy = fields as TOrderBy;

    return this;
  }

  fields(): this {
    if (!this.query.fields) return this;

    const fields = this.query.fields.split(",");

    this.select = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as any);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.skip = (page - 1) * limit;
    this.take = limit;

    return this;
  }

  // build() {
  //   return {
  //     where: this.where,
  //     select: this.select,
  //     orderBy: this.orderBy,
  //     skip: this.skip,
  //     take: this.take,
  //   };
  // }
  build() {
    const query: any = {
      where: this.where,
    };

    if (this.select) {
      query.select = this.select;
    }

    if (this.orderBy) {
      query.orderBy = this.orderBy;
    }

    if (this.skip !== undefined) {
      query.skip = this.skip;
    }

    if (this.take !== undefined) {
      query.take = this.take;
    }

    return query;
  }

  async getMeta(prismaModel: { count: Function }) {
    const total = await prismaModel.count({
      where: this.where,
    });

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };
  }
}
