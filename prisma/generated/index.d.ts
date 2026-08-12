/**
 * Client
 **/

import * as runtime from "./runtime/client.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Booking
 *
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>;
/**
 * Model Destination
 *
 */
export type Destination = $Result.DefaultSelection<Prisma.$DestinationPayload>;
/**
 * Model Favorite
 *
 */
export type Favorite = $Result.DefaultSelection<Prisma.$FavoritePayload>;
/**
 * Model Offer
 *
 */
export type Offer = $Result.DefaultSelection<Prisma.$OfferPayload>;
/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const BookingStatus: {
    draft: "draft";
    confirmed: "confirmed";
    cancelled: "cancelled";
  };

  export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

  export const OfferType: {
    hotel: "hotel";
    flight: "flight";
    tour: "tour";
  };

  export type OfferType = (typeof OfferType)[keyof typeof OfferType];

  export const Currency: {
    BYN: "BYN";
    USD: "USD";
    EUR: "EUR";
  };

  export type Currency = (typeof Currency)[keyof typeof Currency];

  export const OfferStatus: {
    active: "active";
    archived: "archived";
  };

  export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];
}

export type BookingStatus = $Enums.BookingStatus;

export const BookingStatus: typeof $Enums.BookingStatus;

export type OfferType = $Enums.OfferType;

export const OfferType: typeof $Enums.OfferType;

export type Currency = $Enums.Currency;

export const Currency: typeof $Enums.Currency;

export type OfferStatus = $Enums.OfferStatus;

export const OfferStatus: typeof $Enums.OfferStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Bookings
 * const bookings = await prisma.booking.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = "log" extends keyof ClientOptions
    ? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions["log"]>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Bookings
   * const bookings = await prisma.booking.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    "extends",
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Bookings
   * const bookings = await prisma.booking.findMany()
   * ```
   */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.destination`: Exposes CRUD operations for the **Destination** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Destinations
   * const destinations = await prisma.destination.findMany()
   * ```
   */
  get destination(): Prisma.DestinationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.favorite`: Exposes CRUD operations for the **Favorite** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Favorites
   * const favorites = await prisma.favorite.findMany()
   * ```
   */
  get favorite(): Prisma.FavoriteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.offer`: Exposes CRUD operations for the **Offer** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Offers
   * const offers = await prisma.offer.findMany()
   * ```
   */
  get offer(): Prisma.OfferDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string;
    engine: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions,
  ] extends [Options]
    ? PrismaClientOptions
    : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? "Please either choose `select` or `include`."
    : T extends SelectAndOmit
      ? "Please either choose `select` or `omit`."
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? ((Without<T, U> & U) | (Without<U, T> & T)) & object
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<"OR", K>, Extends<"AND", K>>, Extends<"NOT", K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Booking: "Booking";
    Destination: "Destination";
    Favorite: "Favorite";
    Offer: "Offer";
    User: "User";
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this["params"]["extArgs"],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps: "booking" | "destination" | "favorite" | "offer" | "user";
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>;
        fields: Prisma.BookingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[];
          };
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[];
          };
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[];
          };
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>;
          };
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateBooking>;
          };
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<BookingGroupByOutputType>[];
          };
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>;
            result: $Utils.Optional<BookingCountAggregateOutputType> | number;
          };
        };
      };
      Destination: {
        payload: Prisma.$DestinationPayload<ExtArgs>;
        fields: Prisma.DestinationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.DestinationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.DestinationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          findFirst: {
            args: Prisma.DestinationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.DestinationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          findMany: {
            args: Prisma.DestinationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[];
          };
          create: {
            args: Prisma.DestinationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          createMany: {
            args: Prisma.DestinationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.DestinationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[];
          };
          delete: {
            args: Prisma.DestinationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          update: {
            args: Prisma.DestinationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          deleteMany: {
            args: Prisma.DestinationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.DestinationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.DestinationUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>[];
          };
          upsert: {
            args: Prisma.DestinationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DestinationPayload>;
          };
          aggregate: {
            args: Prisma.DestinationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateDestination>;
          };
          groupBy: {
            args: Prisma.DestinationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<DestinationGroupByOutputType>[];
          };
          count: {
            args: Prisma.DestinationCountArgs<ExtArgs>;
            result: $Utils.Optional<DestinationCountAggregateOutputType> | number;
          };
        };
      };
      Favorite: {
        payload: Prisma.$FavoritePayload<ExtArgs>;
        fields: Prisma.FavoriteFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.FavoriteFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.FavoriteFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          findFirst: {
            args: Prisma.FavoriteFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.FavoriteFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          findMany: {
            args: Prisma.FavoriteFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>[];
          };
          create: {
            args: Prisma.FavoriteCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          createMany: {
            args: Prisma.FavoriteCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.FavoriteCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>[];
          };
          delete: {
            args: Prisma.FavoriteDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          update: {
            args: Prisma.FavoriteUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          deleteMany: {
            args: Prisma.FavoriteDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.FavoriteUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.FavoriteUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>[];
          };
          upsert: {
            args: Prisma.FavoriteUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FavoritePayload>;
          };
          aggregate: {
            args: Prisma.FavoriteAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateFavorite>;
          };
          groupBy: {
            args: Prisma.FavoriteGroupByArgs<ExtArgs>;
            result: $Utils.Optional<FavoriteGroupByOutputType>[];
          };
          count: {
            args: Prisma.FavoriteCountArgs<ExtArgs>;
            result: $Utils.Optional<FavoriteCountAggregateOutputType> | number;
          };
        };
      };
      Offer: {
        payload: Prisma.$OfferPayload<ExtArgs>;
        fields: Prisma.OfferFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.OfferFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.OfferFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          findFirst: {
            args: Prisma.OfferFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.OfferFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          findMany: {
            args: Prisma.OfferFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>[];
          };
          create: {
            args: Prisma.OfferCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          createMany: {
            args: Prisma.OfferCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.OfferCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>[];
          };
          delete: {
            args: Prisma.OfferDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          update: {
            args: Prisma.OfferUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          deleteMany: {
            args: Prisma.OfferDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.OfferUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.OfferUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>[];
          };
          upsert: {
            args: Prisma.OfferUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OfferPayload>;
          };
          aggregate: {
            args: Prisma.OfferAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateOffer>;
          };
          groupBy: {
            args: Prisma.OfferGroupByArgs<ExtArgs>;
            result: $Utils.Optional<OfferGroupByOutputType>[];
          };
          count: {
            args: Prisma.OfferCountArgs<ExtArgs>;
            result: $Utils.Optional<OfferCountAggregateOutputType> | number;
          };
        };
      };
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    "define",
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = "pretty" | "colorless" | "minimal";
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     *
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     *
     * Learn more: https://pris.ly/d/driver-adapters
     *
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     *
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory;
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     *
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
  }
  export type GlobalOmitConfig = {
    booking?: BookingOmit;
    destination?: DestinationOmit;
    favorite?: FavoriteOmit;
    offer?: OfferOmit;
    user?: UserOmit;
  };

  /* Types for Logging */
  export type LogLevel = "info" | "query" | "warn" | "error";
  export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T["level"] : T>;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | "findUnique"
    | "findUniqueOrThrow"
    | "findMany"
    | "findFirst"
    | "findFirstOrThrow"
    | "create"
    | "createMany"
    | "createManyAndReturn"
    | "update"
    | "updateMany"
    | "updateManyAndReturn"
    | "upsert"
    | "delete"
    | "deleteMany"
    | "executeRaw"
    | "queryRaw"
    | "aggregate"
    | "count"
    | "runCommandRaw"
    | "findRaw"
    | "groupBy";

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type DestinationCountOutputType
   */

  export type DestinationCountOutputType = {
    offers: number;
  };

  export type DestinationCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offers?: boolean | DestinationCountOutputTypeCountOffersArgs;
  };

  // Custom InputTypes
  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the DestinationCountOutputType
     */
    select?: DestinationCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * DestinationCountOutputType without action
   */
  export type DestinationCountOutputTypeCountOffersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OfferWhereInput;
  };

  /**
   * Count Type OfferCountOutputType
   */

  export type OfferCountOutputType = {
    bookings: number;
    favorites: number;
  };

  export type OfferCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    bookings?: boolean | OfferCountOutputTypeCountBookingsArgs;
    favorites?: boolean | OfferCountOutputTypeCountFavoritesArgs;
  };

  // Custom InputTypes
  /**
   * OfferCountOutputType without action
   */
  export type OfferCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OfferCountOutputType
     */
    select?: OfferCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * OfferCountOutputType without action
   */
  export type OfferCountOutputTypeCountBookingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BookingWhereInput;
  };

  /**
   * OfferCountOutputType without action
   */
  export type OfferCountOutputTypeCountFavoritesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FavoriteWhereInput;
  };

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bookings: number;
    favorites: number;
    offers: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs;
    favorites?: boolean | UserCountOutputTypeCountFavoritesArgs;
    offers?: boolean | UserCountOutputTypeCountOffersArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BookingWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFavoritesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FavoriteWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOffersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OfferWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null;
    _avg: BookingAvgAggregateOutputType | null;
    _sum: BookingSumAggregateOutputType | null;
    _min: BookingMinAggregateOutputType | null;
    _max: BookingMaxAggregateOutputType | null;
  };

  export type BookingAvgAggregateOutputType = {
    guestsCount: number | null;
    totalPrice: Decimal | null;
  };

  export type BookingSumAggregateOutputType = {
    guestsCount: number | null;
    totalPrice: Decimal | null;
  };

  export type BookingMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    offerId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    guestsCount: number | null;
    totalPrice: Decimal | null;
    status: $Enums.BookingStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BookingMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    offerId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    guestsCount: number | null;
    totalPrice: Decimal | null;
    status: $Enums.BookingStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type BookingCountAggregateOutputType = {
    id: number;
    userId: number;
    offerId: number;
    startDate: number;
    endDate: number;
    guestsCount: number;
    totalPrice: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type BookingAvgAggregateInputType = {
    guestsCount?: true;
    totalPrice?: true;
  };

  export type BookingSumAggregateInputType = {
    guestsCount?: true;
    totalPrice?: true;
  };

  export type BookingMinAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    startDate?: true;
    endDate?: true;
    guestsCount?: true;
    totalPrice?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BookingMaxAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    startDate?: true;
    endDate?: true;
    guestsCount?: true;
    totalPrice?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type BookingCountAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    startDate?: true;
    endDate?: true;
    guestsCount?: true;
    totalPrice?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type BookingAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Bookings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Bookings
     **/
    _count?: true | BookingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: BookingAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: BookingSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: BookingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: BookingMaxAggregateInputType;
  };

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
    [P in keyof T & keyof AggregateBooking]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>;
  };

  export type BookingGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: BookingWhereInput;
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[];
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum;
    having?: BookingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BookingCountAggregateInputType | true;
    _avg?: BookingAvgAggregateInputType;
    _sum?: BookingSumAggregateInputType;
    _min?: BookingMinAggregateInputType;
    _max?: BookingMaxAggregateInputType;
  };

  export type BookingGroupByOutputType = {
    id: string;
    userId: string;
    offerId: string;
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    totalPrice: Decimal;
    status: $Enums.BookingStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: BookingCountAggregateOutputType | null;
    _avg: BookingAvgAggregateOutputType | null;
    _sum: BookingSumAggregateOutputType | null;
    _min: BookingMinAggregateOutputType | null;
    _max: BookingMaxAggregateOutputType | null;
  };

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof BookingGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
          : GetScalarType<T[P], BookingGroupByOutputType[P]>;
      }
    >
  >;

  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        userId?: boolean;
        offerId?: boolean;
        startDate?: boolean;
        endDate?: boolean;
        guestsCount?: boolean;
        totalPrice?: boolean;
        status?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        offer?: boolean | OfferDefaultArgs<ExtArgs>;
        user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["booking"]
    >;

  export type BookingSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      offerId?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      guestsCount?: boolean;
      totalPrice?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      offer?: boolean | OfferDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["booking"]
  >;

  export type BookingSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      offerId?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      guestsCount?: boolean;
      totalPrice?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      offer?: boolean | OfferDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["booking"]
  >;

  export type BookingSelectScalar = {
    id?: boolean;
    userId?: boolean;
    offerId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    guestsCount?: boolean;
    totalPrice?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "userId"
      | "offerId"
      | "startDate"
      | "endDate"
      | "guestsCount"
      | "totalPrice"
      | "status"
      | "createdAt"
      | "updatedAt",
      ExtArgs["result"]["booking"]
    >;
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    offer?: boolean | OfferDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type BookingIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offer?: boolean | OfferDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type BookingIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offer?: boolean | OfferDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Booking";
      objects: {
        offer: Prisma.$OfferPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          userId: string;
          offerId: string;
          startDate: Date;
          endDate: Date;
          guestsCount: number;
          totalPrice: Prisma.Decimal;
          status: $Enums.BookingStatus;
          createdAt: Date;
          updatedAt: Date;
        },
        ExtArgs["result"]["booking"]
      >;
      composites: {};
    };

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> =
    $Result.GetResult<Prisma.$BookingPayload, S>;

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    BookingFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: BookingCountAggregateInputType | true;
  };

  export interface BookingDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Booking"]; meta: { name: "Booking" } };
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(
      args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(
      args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(
      args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     *
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BookingFindManyArgs>(
      args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     *
     */
    create<T extends BookingCreateArgs>(
      args: SelectSubset<T, BookingCreateArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BookingCreateManyArgs>(
      args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(
      args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BookingPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     *
     */
    delete<T extends BookingDeleteArgs>(
      args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BookingUpdateArgs>(
      args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BookingDeleteManyArgs>(
      args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BookingUpdateManyArgs>(
      args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(
      args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$BookingPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(
      args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>,
    ): Prisma__BookingClient<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
     **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], BookingCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends BookingAggregateArgs>(
      args: Subset<T, BookingAggregateArgs>,
    ): Prisma.PrismaPromise<GetBookingAggregateType<T>>;

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs["orderBy"] }
        : { orderBy?: BookingGroupByArgs["orderBy"] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T["by"] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Booking model
     */
    readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    offer<T extends OfferDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, OfferDefaultArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      | $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", "String">;
    readonly userId: FieldRef<"Booking", "String">;
    readonly offerId: FieldRef<"Booking", "String">;
    readonly startDate: FieldRef<"Booking", "DateTime">;
    readonly endDate: FieldRef<"Booking", "DateTime">;
    readonly guestsCount: FieldRef<"Booking", "Int">;
    readonly totalPrice: FieldRef<"Booking", "Decimal">;
    readonly status: FieldRef<"Booking", "BookingStatus">;
    readonly createdAt: FieldRef<"Booking", "DateTime">;
    readonly updatedAt: FieldRef<"Booking", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput;
  };

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput;
  };

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Bookings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[];
  };

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Bookings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[];
  };

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Bookings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[];
  };

  /**
   * Booking create
   */
  export type BookingCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>;
  };

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Booking update
   */
  export type BookingUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>;
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput;
  };

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>;
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput;
    /**
     * Limit how many Bookings to update.
     */
    limit?: number;
  };

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>;
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput;
    /**
     * Limit how many Bookings to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput;
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>;
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>;
  };

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput;
  };

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput;
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number;
  };

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
  };

  /**
   * Model Destination
   */

  export type AggregateDestination = {
    _count: DestinationCountAggregateOutputType | null;
    _min: DestinationMinAggregateOutputType | null;
    _max: DestinationMaxAggregateOutputType | null;
  };

  export type DestinationMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    countryCode: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type DestinationMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    countryCode: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type DestinationCountAggregateOutputType = {
    id: number;
    name: number;
    countryCode: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type DestinationMinAggregateInputType = {
    id?: true;
    name?: true;
    countryCode?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type DestinationMaxAggregateInputType = {
    id?: true;
    name?: true;
    countryCode?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type DestinationCountAggregateInputType = {
    id?: true;
    name?: true;
    countryCode?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type DestinationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Destination to aggregate.
     */
    where?: DestinationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: DestinationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Destinations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Destinations
     **/
    _count?: true | DestinationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: DestinationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: DestinationMaxAggregateInputType;
  };

  export type GetDestinationAggregateType<T extends DestinationAggregateArgs> = {
    [P in keyof T & keyof AggregateDestination]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDestination[P]>
      : GetScalarType<T[P], AggregateDestination[P]>;
  };

  export type DestinationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: DestinationWhereInput;
    orderBy?: DestinationOrderByWithAggregationInput | DestinationOrderByWithAggregationInput[];
    by: DestinationScalarFieldEnum[] | DestinationScalarFieldEnum;
    having?: DestinationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DestinationCountAggregateInputType | true;
    _min?: DestinationMinAggregateInputType;
    _max?: DestinationMaxAggregateInputType;
  };

  export type DestinationGroupByOutputType = {
    id: string;
    name: string;
    countryCode: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: DestinationCountAggregateOutputType | null;
    _min: DestinationMinAggregateOutputType | null;
    _max: DestinationMaxAggregateOutputType | null;
  };

  type GetDestinationGroupByPayload<T extends DestinationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DestinationGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof DestinationGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], DestinationGroupByOutputType[P]>
          : GetScalarType<T[P], DestinationGroupByOutputType[P]>;
      }
    >
  >;

  export type DestinationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      countryCode?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      offers?: boolean | Destination$offersArgs<ExtArgs>;
      _count?: boolean | DestinationCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["destination"]
  >;

  export type DestinationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      countryCode?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["destination"]
  >;

  export type DestinationSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      countryCode?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["destination"]
  >;

  export type DestinationSelectScalar = {
    id?: boolean;
    name?: boolean;
    countryCode?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type DestinationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      "id" | "name" | "countryCode" | "description" | "createdAt" | "updatedAt",
      ExtArgs["result"]["destination"]
    >;
  export type DestinationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offers?: boolean | Destination$offersArgs<ExtArgs>;
    _count?: boolean | DestinationCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type DestinationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type DestinationIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $DestinationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "Destination";
    objects: {
      offers: Prisma.$OfferPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        countryCode: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["destination"]
    >;
    composites: {};
  };

  type DestinationGetPayload<S extends boolean | null | undefined | DestinationDefaultArgs> =
    $Result.GetResult<Prisma.$DestinationPayload, S>;

  type DestinationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DestinationFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
      select?: DestinationCountAggregateInputType | true;
    };

  export interface DestinationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["Destination"];
      meta: { name: "Destination" };
    };
    /**
     * Find zero or one Destination that matches the filter.
     * @param {DestinationFindUniqueArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DestinationFindUniqueArgs>(
      args: SelectSubset<T, DestinationFindUniqueArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Destination that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DestinationFindUniqueOrThrowArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DestinationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, DestinationFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Destination that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindFirstArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DestinationFindFirstArgs>(
      args?: SelectSubset<T, DestinationFindFirstArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Destination that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindFirstOrThrowArgs} args - Arguments to find a Destination
     * @example
     * // Get one Destination
     * const destination = await prisma.destination.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DestinationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, DestinationFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Destinations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Destinations
     * const destinations = await prisma.destination.findMany()
     *
     * // Get first 10 Destinations
     * const destinations = await prisma.destination.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const destinationWithIdOnly = await prisma.destination.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DestinationFindManyArgs>(
      args?: SelectSubset<T, DestinationFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Destination.
     * @param {DestinationCreateArgs} args - Arguments to create a Destination.
     * @example
     * // Create one Destination
     * const Destination = await prisma.destination.create({
     *   data: {
     *     // ... data to create a Destination
     *   }
     * })
     *
     */
    create<T extends DestinationCreateArgs>(
      args: SelectSubset<T, DestinationCreateArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Destinations.
     * @param {DestinationCreateManyArgs} args - Arguments to create many Destinations.
     * @example
     * // Create many Destinations
     * const destination = await prisma.destination.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DestinationCreateManyArgs>(
      args?: SelectSubset<T, DestinationCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Destinations and returns the data saved in the database.
     * @param {DestinationCreateManyAndReturnArgs} args - Arguments to create many Destinations.
     * @example
     * // Create many Destinations
     * const destination = await prisma.destination.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Destinations and only return the `id`
     * const destinationWithIdOnly = await prisma.destination.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends DestinationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, DestinationCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Destination.
     * @param {DestinationDeleteArgs} args - Arguments to delete one Destination.
     * @example
     * // Delete one Destination
     * const Destination = await prisma.destination.delete({
     *   where: {
     *     // ... filter to delete one Destination
     *   }
     * })
     *
     */
    delete<T extends DestinationDeleteArgs>(
      args: SelectSubset<T, DestinationDeleteArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Destination.
     * @param {DestinationUpdateArgs} args - Arguments to update one Destination.
     * @example
     * // Update one Destination
     * const destination = await prisma.destination.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DestinationUpdateArgs>(
      args: SelectSubset<T, DestinationUpdateArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Destinations.
     * @param {DestinationDeleteManyArgs} args - Arguments to filter Destinations to delete.
     * @example
     * // Delete a few Destinations
     * const { count } = await prisma.destination.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DestinationDeleteManyArgs>(
      args?: SelectSubset<T, DestinationDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Destinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Destinations
     * const destination = await prisma.destination.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DestinationUpdateManyArgs>(
      args: SelectSubset<T, DestinationUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Destinations and returns the data updated in the database.
     * @param {DestinationUpdateManyAndReturnArgs} args - Arguments to update many Destinations.
     * @example
     * // Update many Destinations
     * const destination = await prisma.destination.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Destinations and only return the `id`
     * const destinationWithIdOnly = await prisma.destination.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends DestinationUpdateManyAndReturnArgs>(
      args: SelectSubset<T, DestinationUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$DestinationPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Destination.
     * @param {DestinationUpsertArgs} args - Arguments to update or create a Destination.
     * @example
     * // Update or create a Destination
     * const destination = await prisma.destination.upsert({
     *   create: {
     *     // ... data to create a Destination
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Destination we want to update
     *   }
     * })
     */
    upsert<T extends DestinationUpsertArgs>(
      args: SelectSubset<T, DestinationUpsertArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      $Result.GetResult<Prisma.$DestinationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Destinations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationCountArgs} args - Arguments to filter Destinations to count.
     * @example
     * // Count the number of Destinations
     * const count = await prisma.destination.count({
     *   where: {
     *     // ... the filter for the Destinations we want to count
     *   }
     * })
     **/
    count<T extends DestinationCountArgs>(
      args?: Subset<T, DestinationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], DestinationCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Destination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends DestinationAggregateArgs>(
      args: Subset<T, DestinationAggregateArgs>,
    ): Prisma.PrismaPromise<GetDestinationAggregateType<T>>;

    /**
     * Group by Destination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DestinationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends DestinationGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: DestinationGroupByArgs["orderBy"] }
        : { orderBy?: DestinationGroupByArgs["orderBy"] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T["by"] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, DestinationGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetDestinationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Destination model
     */
    readonly fields: DestinationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Destination.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DestinationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    offers<T extends Destination$offersArgs<ExtArgs> = {}>(
      args?: Subset<T, Destination$offersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Destination model
   */
  interface DestinationFieldRefs {
    readonly id: FieldRef<"Destination", "String">;
    readonly name: FieldRef<"Destination", "String">;
    readonly countryCode: FieldRef<"Destination", "String">;
    readonly description: FieldRef<"Destination", "String">;
    readonly createdAt: FieldRef<"Destination", "DateTime">;
    readonly updatedAt: FieldRef<"Destination", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Destination findUnique
   */
  export type DestinationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter, which Destination to fetch.
     */
    where: DestinationWhereUniqueInput;
  };

  /**
   * Destination findUniqueOrThrow
   */
  export type DestinationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter, which Destination to fetch.
     */
    where: DestinationWhereUniqueInput;
  };

  /**
   * Destination findFirst
   */
  export type DestinationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter, which Destination to fetch.
     */
    where?: DestinationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Destinations.
     */
    cursor?: DestinationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Destinations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Destinations.
     */
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[];
  };

  /**
   * Destination findFirstOrThrow
   */
  export type DestinationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter, which Destination to fetch.
     */
    where?: DestinationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Destinations.
     */
    cursor?: DestinationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Destinations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Destinations.
     */
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[];
  };

  /**
   * Destination findMany
   */
  export type DestinationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter, which Destinations to fetch.
     */
    where?: DestinationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Destinations to fetch.
     */
    orderBy?: DestinationOrderByWithRelationInput | DestinationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Destinations.
     */
    cursor?: DestinationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Destinations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Destinations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Destinations.
     */
    distinct?: DestinationScalarFieldEnum | DestinationScalarFieldEnum[];
  };

  /**
   * Destination create
   */
  export type DestinationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * The data needed to create a Destination.
     */
    data: XOR<DestinationCreateInput, DestinationUncheckedCreateInput>;
  };

  /**
   * Destination createMany
   */
  export type DestinationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Destinations.
     */
    data: DestinationCreateManyInput | DestinationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Destination createManyAndReturn
   */
  export type DestinationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * The data used to create many Destinations.
     */
    data: DestinationCreateManyInput | DestinationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Destination update
   */
  export type DestinationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * The data needed to update a Destination.
     */
    data: XOR<DestinationUpdateInput, DestinationUncheckedUpdateInput>;
    /**
     * Choose, which Destination to update.
     */
    where: DestinationWhereUniqueInput;
  };

  /**
   * Destination updateMany
   */
  export type DestinationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Destinations.
     */
    data: XOR<DestinationUpdateManyMutationInput, DestinationUncheckedUpdateManyInput>;
    /**
     * Filter which Destinations to update
     */
    where?: DestinationWhereInput;
    /**
     * Limit how many Destinations to update.
     */
    limit?: number;
  };

  /**
   * Destination updateManyAndReturn
   */
  export type DestinationUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * The data used to update Destinations.
     */
    data: XOR<DestinationUpdateManyMutationInput, DestinationUncheckedUpdateManyInput>;
    /**
     * Filter which Destinations to update
     */
    where?: DestinationWhereInput;
    /**
     * Limit how many Destinations to update.
     */
    limit?: number;
  };

  /**
   * Destination upsert
   */
  export type DestinationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * The filter to search for the Destination to update in case it exists.
     */
    where: DestinationWhereUniqueInput;
    /**
     * In case the Destination found by the `where` argument doesn't exist, create a new Destination with this data.
     */
    create: XOR<DestinationCreateInput, DestinationUncheckedCreateInput>;
    /**
     * In case the Destination was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DestinationUpdateInput, DestinationUncheckedUpdateInput>;
  };

  /**
   * Destination delete
   */
  export type DestinationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
    /**
     * Filter which Destination to delete.
     */
    where: DestinationWhereUniqueInput;
  };

  /**
   * Destination deleteMany
   */
  export type DestinationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Destinations to delete
     */
    where?: DestinationWhereInput;
    /**
     * Limit how many Destinations to delete.
     */
    limit?: number;
  };

  /**
   * Destination.offers
   */
  export type Destination$offersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    where?: OfferWhereInput;
    orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
    cursor?: OfferWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: OfferScalarFieldEnum | OfferScalarFieldEnum[];
  };

  /**
   * Destination without action
   */
  export type DestinationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Destination
     */
    select?: DestinationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Destination
     */
    omit?: DestinationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DestinationInclude<ExtArgs> | null;
  };

  /**
   * Model Favorite
   */

  export type AggregateFavorite = {
    _count: FavoriteCountAggregateOutputType | null;
    _min: FavoriteMinAggregateOutputType | null;
    _max: FavoriteMaxAggregateOutputType | null;
  };

  export type FavoriteMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    offerId: string | null;
    createdAt: Date | null;
  };

  export type FavoriteMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    offerId: string | null;
    createdAt: Date | null;
  };

  export type FavoriteCountAggregateOutputType = {
    id: number;
    userId: number;
    offerId: number;
    createdAt: number;
    _all: number;
  };

  export type FavoriteMinAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    createdAt?: true;
  };

  export type FavoriteMaxAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    createdAt?: true;
  };

  export type FavoriteCountAggregateInputType = {
    id?: true;
    userId?: true;
    offerId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type FavoriteAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Favorite to aggregate.
     */
    where?: FavoriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Favorites to fetch.
     */
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: FavoriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Favorites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Favorites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Favorites
     **/
    _count?: true | FavoriteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: FavoriteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: FavoriteMaxAggregateInputType;
  };

  export type GetFavoriteAggregateType<T extends FavoriteAggregateArgs> = {
    [P in keyof T & keyof AggregateFavorite]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFavorite[P]>
      : GetScalarType<T[P], AggregateFavorite[P]>;
  };

  export type FavoriteGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FavoriteWhereInput;
    orderBy?: FavoriteOrderByWithAggregationInput | FavoriteOrderByWithAggregationInput[];
    by: FavoriteScalarFieldEnum[] | FavoriteScalarFieldEnum;
    having?: FavoriteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FavoriteCountAggregateInputType | true;
    _min?: FavoriteMinAggregateInputType;
    _max?: FavoriteMaxAggregateInputType;
  };

  export type FavoriteGroupByOutputType = {
    id: string;
    userId: string;
    offerId: string;
    createdAt: Date;
    _count: FavoriteCountAggregateOutputType | null;
    _min: FavoriteMinAggregateOutputType | null;
    _max: FavoriteMaxAggregateOutputType | null;
  };

  type GetFavoriteGroupByPayload<T extends FavoriteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FavoriteGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof FavoriteGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], FavoriteGroupByOutputType[P]>
          : GetScalarType<T[P], FavoriteGroupByOutputType[P]>;
      }
    >
  >;

  export type FavoriteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        userId?: boolean;
        offerId?: boolean;
        createdAt?: boolean;
        offer?: boolean | OfferDefaultArgs<ExtArgs>;
        user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["favorite"]
    >;

  export type FavoriteSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      offerId?: boolean;
      createdAt?: boolean;
      offer?: boolean | OfferDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["favorite"]
  >;

  export type FavoriteSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      offerId?: boolean;
      createdAt?: boolean;
      offer?: boolean | OfferDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["favorite"]
  >;

  export type FavoriteSelectScalar = {
    id?: boolean;
    userId?: boolean;
    offerId?: boolean;
    createdAt?: boolean;
  };

  export type FavoriteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<"id" | "userId" | "offerId" | "createdAt", ExtArgs["result"]["favorite"]>;
  export type FavoriteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      offer?: boolean | OfferDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    };
  export type FavoriteIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offer?: boolean | OfferDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FavoriteIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    offer?: boolean | OfferDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $FavoritePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: "Favorite";
      objects: {
        offer: Prisma.$OfferPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          userId: string;
          offerId: string;
          createdAt: Date;
        },
        ExtArgs["result"]["favorite"]
      >;
      composites: {};
    };

  type FavoriteGetPayload<S extends boolean | null | undefined | FavoriteDefaultArgs> =
    $Result.GetResult<Prisma.$FavoritePayload, S>;

  type FavoriteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    FavoriteFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: FavoriteCountAggregateInputType | true;
  };

  export interface FavoriteDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["Favorite"];
      meta: { name: "Favorite" };
    };
    /**
     * Find zero or one Favorite that matches the filter.
     * @param {FavoriteFindUniqueArgs} args - Arguments to find a Favorite
     * @example
     * // Get one Favorite
     * const favorite = await prisma.favorite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FavoriteFindUniqueArgs>(
      args: SelectSubset<T, FavoriteFindUniqueArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<
        Prisma.$FavoritePayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Favorite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FavoriteFindUniqueOrThrowArgs} args - Arguments to find a Favorite
     * @example
     * // Get one Favorite
     * const favorite = await prisma.favorite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FavoriteFindUniqueOrThrowArgs>(
      args: SelectSubset<T, FavoriteFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<
        Prisma.$FavoritePayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Favorite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteFindFirstArgs} args - Arguments to find a Favorite
     * @example
     * // Get one Favorite
     * const favorite = await prisma.favorite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FavoriteFindFirstArgs>(
      args?: SelectSubset<T, FavoriteFindFirstArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Favorite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteFindFirstOrThrowArgs} args - Arguments to find a Favorite
     * @example
     * // Get one Favorite
     * const favorite = await prisma.favorite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FavoriteFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FavoriteFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Favorites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Favorites
     * const favorites = await prisma.favorite.findMany()
     *
     * // Get first 10 Favorites
     * const favorites = await prisma.favorite.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const favoriteWithIdOnly = await prisma.favorite.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FavoriteFindManyArgs>(
      args?: SelectSubset<T, FavoriteFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Favorite.
     * @param {FavoriteCreateArgs} args - Arguments to create a Favorite.
     * @example
     * // Create one Favorite
     * const Favorite = await prisma.favorite.create({
     *   data: {
     *     // ... data to create a Favorite
     *   }
     * })
     *
     */
    create<T extends FavoriteCreateArgs>(
      args: SelectSubset<T, FavoriteCreateArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Favorites.
     * @param {FavoriteCreateManyArgs} args - Arguments to create many Favorites.
     * @example
     * // Create many Favorites
     * const favorite = await prisma.favorite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FavoriteCreateManyArgs>(
      args?: SelectSubset<T, FavoriteCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Favorites and returns the data saved in the database.
     * @param {FavoriteCreateManyAndReturnArgs} args - Arguments to create many Favorites.
     * @example
     * // Create many Favorites
     * const favorite = await prisma.favorite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Favorites and only return the `id`
     * const favoriteWithIdOnly = await prisma.favorite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FavoriteCreateManyAndReturnArgs>(
      args?: SelectSubset<T, FavoriteCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FavoritePayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Favorite.
     * @param {FavoriteDeleteArgs} args - Arguments to delete one Favorite.
     * @example
     * // Delete one Favorite
     * const Favorite = await prisma.favorite.delete({
     *   where: {
     *     // ... filter to delete one Favorite
     *   }
     * })
     *
     */
    delete<T extends FavoriteDeleteArgs>(
      args: SelectSubset<T, FavoriteDeleteArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Favorite.
     * @param {FavoriteUpdateArgs} args - Arguments to update one Favorite.
     * @example
     * // Update one Favorite
     * const favorite = await prisma.favorite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FavoriteUpdateArgs>(
      args: SelectSubset<T, FavoriteUpdateArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Favorites.
     * @param {FavoriteDeleteManyArgs} args - Arguments to filter Favorites to delete.
     * @example
     * // Delete a few Favorites
     * const { count } = await prisma.favorite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FavoriteDeleteManyArgs>(
      args?: SelectSubset<T, FavoriteDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Favorites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Favorites
     * const favorite = await prisma.favorite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FavoriteUpdateManyArgs>(
      args: SelectSubset<T, FavoriteUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Favorites and returns the data updated in the database.
     * @param {FavoriteUpdateManyAndReturnArgs} args - Arguments to update many Favorites.
     * @example
     * // Update many Favorites
     * const favorite = await prisma.favorite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Favorites and only return the `id`
     * const favoriteWithIdOnly = await prisma.favorite.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends FavoriteUpdateManyAndReturnArgs>(
      args: SelectSubset<T, FavoriteUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FavoritePayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Favorite.
     * @param {FavoriteUpsertArgs} args - Arguments to update or create a Favorite.
     * @example
     * // Update or create a Favorite
     * const favorite = await prisma.favorite.upsert({
     *   create: {
     *     // ... data to create a Favorite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Favorite we want to update
     *   }
     * })
     */
    upsert<T extends FavoriteUpsertArgs>(
      args: SelectSubset<T, FavoriteUpsertArgs<ExtArgs>>,
    ): Prisma__FavoriteClient<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Favorites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteCountArgs} args - Arguments to filter Favorites to count.
     * @example
     * // Count the number of Favorites
     * const count = await prisma.favorite.count({
     *   where: {
     *     // ... the filter for the Favorites we want to count
     *   }
     * })
     **/
    count<T extends FavoriteCountArgs>(
      args?: Subset<T, FavoriteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], FavoriteCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Favorite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends FavoriteAggregateArgs>(
      args: Subset<T, FavoriteAggregateArgs>,
    ): Prisma.PrismaPromise<GetFavoriteAggregateType<T>>;

    /**
     * Group by Favorite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends FavoriteGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: FavoriteGroupByArgs["orderBy"] }
        : { orderBy?: FavoriteGroupByArgs["orderBy"] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T["by"] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, FavoriteGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetFavoriteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Favorite model
     */
    readonly fields: FavoriteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Favorite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FavoriteClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    offer<T extends OfferDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, OfferDefaultArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      | $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Favorite model
   */
  interface FavoriteFieldRefs {
    readonly id: FieldRef<"Favorite", "String">;
    readonly userId: FieldRef<"Favorite", "String">;
    readonly offerId: FieldRef<"Favorite", "String">;
    readonly createdAt: FieldRef<"Favorite", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Favorite findUnique
   */
  export type FavoriteFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter, which Favorite to fetch.
     */
    where: FavoriteWhereUniqueInput;
  };

  /**
   * Favorite findUniqueOrThrow
   */
  export type FavoriteFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter, which Favorite to fetch.
     */
    where: FavoriteWhereUniqueInput;
  };

  /**
   * Favorite findFirst
   */
  export type FavoriteFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter, which Favorite to fetch.
     */
    where?: FavoriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Favorites to fetch.
     */
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Favorites.
     */
    cursor?: FavoriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Favorites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Favorites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Favorites.
     */
    distinct?: FavoriteScalarFieldEnum | FavoriteScalarFieldEnum[];
  };

  /**
   * Favorite findFirstOrThrow
   */
  export type FavoriteFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter, which Favorite to fetch.
     */
    where?: FavoriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Favorites to fetch.
     */
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Favorites.
     */
    cursor?: FavoriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Favorites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Favorites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Favorites.
     */
    distinct?: FavoriteScalarFieldEnum | FavoriteScalarFieldEnum[];
  };

  /**
   * Favorite findMany
   */
  export type FavoriteFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter, which Favorites to fetch.
     */
    where?: FavoriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Favorites to fetch.
     */
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Favorites.
     */
    cursor?: FavoriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Favorites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Favorites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Favorites.
     */
    distinct?: FavoriteScalarFieldEnum | FavoriteScalarFieldEnum[];
  };

  /**
   * Favorite create
   */
  export type FavoriteCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * The data needed to create a Favorite.
     */
    data: XOR<FavoriteCreateInput, FavoriteUncheckedCreateInput>;
  };

  /**
   * Favorite createMany
   */
  export type FavoriteCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Favorites.
     */
    data: FavoriteCreateManyInput | FavoriteCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Favorite createManyAndReturn
   */
  export type FavoriteCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * The data used to create many Favorites.
     */
    data: FavoriteCreateManyInput | FavoriteCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Favorite update
   */
  export type FavoriteUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * The data needed to update a Favorite.
     */
    data: XOR<FavoriteUpdateInput, FavoriteUncheckedUpdateInput>;
    /**
     * Choose, which Favorite to update.
     */
    where: FavoriteWhereUniqueInput;
  };

  /**
   * Favorite updateMany
   */
  export type FavoriteUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Favorites.
     */
    data: XOR<FavoriteUpdateManyMutationInput, FavoriteUncheckedUpdateManyInput>;
    /**
     * Filter which Favorites to update
     */
    where?: FavoriteWhereInput;
    /**
     * Limit how many Favorites to update.
     */
    limit?: number;
  };

  /**
   * Favorite updateManyAndReturn
   */
  export type FavoriteUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * The data used to update Favorites.
     */
    data: XOR<FavoriteUpdateManyMutationInput, FavoriteUncheckedUpdateManyInput>;
    /**
     * Filter which Favorites to update
     */
    where?: FavoriteWhereInput;
    /**
     * Limit how many Favorites to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Favorite upsert
   */
  export type FavoriteUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * The filter to search for the Favorite to update in case it exists.
     */
    where: FavoriteWhereUniqueInput;
    /**
     * In case the Favorite found by the `where` argument doesn't exist, create a new Favorite with this data.
     */
    create: XOR<FavoriteCreateInput, FavoriteUncheckedCreateInput>;
    /**
     * In case the Favorite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FavoriteUpdateInput, FavoriteUncheckedUpdateInput>;
  };

  /**
   * Favorite delete
   */
  export type FavoriteDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    /**
     * Filter which Favorite to delete.
     */
    where: FavoriteWhereUniqueInput;
  };

  /**
   * Favorite deleteMany
   */
  export type FavoriteDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Favorites to delete
     */
    where?: FavoriteWhereInput;
    /**
     * Limit how many Favorites to delete.
     */
    limit?: number;
  };

  /**
   * Favorite without action
   */
  export type FavoriteDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
  };

  /**
   * Model Offer
   */

  export type AggregateOffer = {
    _count: OfferCountAggregateOutputType | null;
    _avg: OfferAvgAggregateOutputType | null;
    _sum: OfferSumAggregateOutputType | null;
    _min: OfferMinAggregateOutputType | null;
    _max: OfferMaxAggregateOutputType | null;
  };

  export type OfferAvgAggregateOutputType = {
    price: Decimal | null;
    maxGuests: number | null;
    maxConcurrentBookings: number | null;
    stars: number | null;
    durationDays: number | null;
  };

  export type OfferSumAggregateOutputType = {
    price: Decimal | null;
    maxGuests: number | null;
    maxConcurrentBookings: number | null;
    stars: number | null;
    durationDays: number | null;
  };

  export type OfferMinAggregateOutputType = {
    id: string | null;
    type: $Enums.OfferType | null;
    destinationId: string | null;
    ownerId: string | null;
    title: string | null;
    description: string | null;
    price: Decimal | null;
    currency: $Enums.Currency | null;
    maxGuests: number | null;
    maxConcurrentBookings: number | null;
    availableFrom: Date | null;
    availableTo: Date | null;
    status: $Enums.OfferStatus | null;
    stars: number | null;
    address: string | null;
    flightNumber: string | null;
    airline: string | null;
    durationDays: number | null;
    includesMeals: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type OfferMaxAggregateOutputType = {
    id: string | null;
    type: $Enums.OfferType | null;
    destinationId: string | null;
    ownerId: string | null;
    title: string | null;
    description: string | null;
    price: Decimal | null;
    currency: $Enums.Currency | null;
    maxGuests: number | null;
    maxConcurrentBookings: number | null;
    availableFrom: Date | null;
    availableTo: Date | null;
    status: $Enums.OfferStatus | null;
    stars: number | null;
    address: string | null;
    flightNumber: string | null;
    airline: string | null;
    durationDays: number | null;
    includesMeals: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type OfferCountAggregateOutputType = {
    id: number;
    type: number;
    destinationId: number;
    ownerId: number;
    title: number;
    description: number;
    price: number;
    currency: number;
    maxGuests: number;
    maxConcurrentBookings: number;
    availableFrom: number;
    availableTo: number;
    status: number;
    stars: number;
    address: number;
    flightNumber: number;
    airline: number;
    durationDays: number;
    includesMeals: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type OfferAvgAggregateInputType = {
    price?: true;
    maxGuests?: true;
    maxConcurrentBookings?: true;
    stars?: true;
    durationDays?: true;
  };

  export type OfferSumAggregateInputType = {
    price?: true;
    maxGuests?: true;
    maxConcurrentBookings?: true;
    stars?: true;
    durationDays?: true;
  };

  export type OfferMinAggregateInputType = {
    id?: true;
    type?: true;
    destinationId?: true;
    ownerId?: true;
    title?: true;
    description?: true;
    price?: true;
    currency?: true;
    maxGuests?: true;
    maxConcurrentBookings?: true;
    availableFrom?: true;
    availableTo?: true;
    status?: true;
    stars?: true;
    address?: true;
    flightNumber?: true;
    airline?: true;
    durationDays?: true;
    includesMeals?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type OfferMaxAggregateInputType = {
    id?: true;
    type?: true;
    destinationId?: true;
    ownerId?: true;
    title?: true;
    description?: true;
    price?: true;
    currency?: true;
    maxGuests?: true;
    maxConcurrentBookings?: true;
    availableFrom?: true;
    availableTo?: true;
    status?: true;
    stars?: true;
    address?: true;
    flightNumber?: true;
    airline?: true;
    durationDays?: true;
    includesMeals?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type OfferCountAggregateInputType = {
    id?: true;
    type?: true;
    destinationId?: true;
    ownerId?: true;
    title?: true;
    description?: true;
    price?: true;
    currency?: true;
    maxGuests?: true;
    maxConcurrentBookings?: true;
    availableFrom?: true;
    availableTo?: true;
    status?: true;
    stars?: true;
    address?: true;
    flightNumber?: true;
    airline?: true;
    durationDays?: true;
    includesMeals?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type OfferAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Offer to aggregate.
     */
    where?: OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Offers
     **/
    _count?: true | OfferCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: OfferAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: OfferSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: OfferMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: OfferMaxAggregateInputType;
  };

  export type GetOfferAggregateType<T extends OfferAggregateArgs> = {
    [P in keyof T & keyof AggregateOffer]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOffer[P]>
      : GetScalarType<T[P], AggregateOffer[P]>;
  };

  export type OfferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: OfferWhereInput;
      orderBy?: OfferOrderByWithAggregationInput | OfferOrderByWithAggregationInput[];
      by: OfferScalarFieldEnum[] | OfferScalarFieldEnum;
      having?: OfferScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: OfferCountAggregateInputType | true;
      _avg?: OfferAvgAggregateInputType;
      _sum?: OfferSumAggregateInputType;
      _min?: OfferMinAggregateInputType;
      _max?: OfferMaxAggregateInputType;
    };

  export type OfferGroupByOutputType = {
    id: string;
    type: $Enums.OfferType;
    destinationId: string;
    ownerId: string;
    title: string;
    description: string | null;
    price: Decimal;
    currency: $Enums.Currency;
    maxGuests: number;
    maxConcurrentBookings: number;
    availableFrom: Date;
    availableTo: Date;
    status: $Enums.OfferStatus;
    stars: number | null;
    address: string | null;
    flightNumber: string | null;
    airline: string | null;
    durationDays: number | null;
    includesMeals: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: OfferCountAggregateOutputType | null;
    _avg: OfferAvgAggregateOutputType | null;
    _sum: OfferSumAggregateOutputType | null;
    _min: OfferMinAggregateOutputType | null;
    _max: OfferMaxAggregateOutputType | null;
  };

  type GetOfferGroupByPayload<T extends OfferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OfferGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof OfferGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], OfferGroupByOutputType[P]>
          : GetScalarType<T[P], OfferGroupByOutputType[P]>;
      }
    >
  >;

  export type OfferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        type?: boolean;
        destinationId?: boolean;
        ownerId?: boolean;
        title?: boolean;
        description?: boolean;
        price?: boolean;
        currency?: boolean;
        maxGuests?: boolean;
        maxConcurrentBookings?: boolean;
        availableFrom?: boolean;
        availableTo?: boolean;
        status?: boolean;
        stars?: boolean;
        address?: boolean;
        flightNumber?: boolean;
        airline?: boolean;
        durationDays?: boolean;
        includesMeals?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        deletedAt?: boolean;
        bookings?: boolean | Offer$bookingsArgs<ExtArgs>;
        favorites?: boolean | Offer$favoritesArgs<ExtArgs>;
        destination?: boolean | DestinationDefaultArgs<ExtArgs>;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        _count?: boolean | OfferCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["offer"]
    >;

  export type OfferSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      type?: boolean;
      destinationId?: boolean;
      ownerId?: boolean;
      title?: boolean;
      description?: boolean;
      price?: boolean;
      currency?: boolean;
      maxGuests?: boolean;
      maxConcurrentBookings?: boolean;
      availableFrom?: boolean;
      availableTo?: boolean;
      status?: boolean;
      stars?: boolean;
      address?: boolean;
      flightNumber?: boolean;
      airline?: boolean;
      durationDays?: boolean;
      includesMeals?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      destination?: boolean | DestinationDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["offer"]
  >;

  export type OfferSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      type?: boolean;
      destinationId?: boolean;
      ownerId?: boolean;
      title?: boolean;
      description?: boolean;
      price?: boolean;
      currency?: boolean;
      maxGuests?: boolean;
      maxConcurrentBookings?: boolean;
      availableFrom?: boolean;
      availableTo?: boolean;
      status?: boolean;
      stars?: boolean;
      address?: boolean;
      flightNumber?: boolean;
      airline?: boolean;
      durationDays?: boolean;
      includesMeals?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      destination?: boolean | DestinationDefaultArgs<ExtArgs>;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["offer"]
  >;

  export type OfferSelectScalar = {
    id?: boolean;
    type?: boolean;
    destinationId?: boolean;
    ownerId?: boolean;
    title?: boolean;
    description?: boolean;
    price?: boolean;
    currency?: boolean;
    maxGuests?: boolean;
    maxConcurrentBookings?: boolean;
    availableFrom?: boolean;
    availableTo?: boolean;
    status?: boolean;
    stars?: boolean;
    address?: boolean;
    flightNumber?: boolean;
    airline?: boolean;
    durationDays?: boolean;
    includesMeals?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type OfferOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | "id"
      | "type"
      | "destinationId"
      | "ownerId"
      | "title"
      | "description"
      | "price"
      | "currency"
      | "maxGuests"
      | "maxConcurrentBookings"
      | "availableFrom"
      | "availableTo"
      | "status"
      | "stars"
      | "address"
      | "flightNumber"
      | "airline"
      | "durationDays"
      | "includesMeals"
      | "createdAt"
      | "updatedAt"
      | "deletedAt",
      ExtArgs["result"]["offer"]
    >;
  export type OfferInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | Offer$bookingsArgs<ExtArgs>;
    favorites?: boolean | Offer$favoritesArgs<ExtArgs>;
    destination?: boolean | DestinationDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
    _count?: boolean | OfferCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type OfferIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    destination?: boolean | DestinationDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type OfferIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    destination?: boolean | DestinationDefaultArgs<ExtArgs>;
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $OfferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Offer";
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[];
      favorites: Prisma.$FavoritePayload<ExtArgs>[];
      destination: Prisma.$DestinationPayload<ExtArgs>;
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        type: $Enums.OfferType;
        destinationId: string;
        ownerId: string;
        title: string;
        description: string | null;
        price: Prisma.Decimal;
        currency: $Enums.Currency;
        maxGuests: number;
        maxConcurrentBookings: number;
        availableFrom: Date;
        availableTo: Date;
        status: $Enums.OfferStatus;
        stars: number | null;
        address: string | null;
        flightNumber: string | null;
        airline: string | null;
        durationDays: number | null;
        includesMeals: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs["result"]["offer"]
    >;
    composites: {};
  };

  type OfferGetPayload<S extends boolean | null | undefined | OfferDefaultArgs> = $Result.GetResult<
    Prisma.$OfferPayload,
    S
  >;

  type OfferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    OfferFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: OfferCountAggregateInputType | true;
  };

  export interface OfferDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["Offer"]; meta: { name: "Offer" } };
    /**
     * Find zero or one Offer that matches the filter.
     * @param {OfferFindUniqueArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OfferFindUniqueArgs>(
      args: SelectSubset<T, OfferFindUniqueArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Offer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OfferFindUniqueOrThrowArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OfferFindUniqueOrThrowArgs>(
      args: SelectSubset<T, OfferFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Offer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindFirstArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OfferFindFirstArgs>(
      args?: SelectSubset<T, OfferFindFirstArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Offer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindFirstOrThrowArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OfferFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OfferFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Offers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Offers
     * const offers = await prisma.offer.findMany()
     *
     * // Get first 10 Offers
     * const offers = await prisma.offer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const offerWithIdOnly = await prisma.offer.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OfferFindManyArgs>(
      args?: SelectSubset<T, OfferFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a Offer.
     * @param {OfferCreateArgs} args - Arguments to create a Offer.
     * @example
     * // Create one Offer
     * const Offer = await prisma.offer.create({
     *   data: {
     *     // ... data to create a Offer
     *   }
     * })
     *
     */
    create<T extends OfferCreateArgs>(
      args: SelectSubset<T, OfferCreateArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Offers.
     * @param {OfferCreateManyArgs} args - Arguments to create many Offers.
     * @example
     * // Create many Offers
     * const offer = await prisma.offer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OfferCreateManyArgs>(
      args?: SelectSubset<T, OfferCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Offers and returns the data saved in the database.
     * @param {OfferCreateManyAndReturnArgs} args - Arguments to create many Offers.
     * @example
     * // Create many Offers
     * const offer = await prisma.offer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Offers and only return the `id`
     * const offerWithIdOnly = await prisma.offer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OfferCreateManyAndReturnArgs>(
      args?: SelectSubset<T, OfferCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Delete a Offer.
     * @param {OfferDeleteArgs} args - Arguments to delete one Offer.
     * @example
     * // Delete one Offer
     * const Offer = await prisma.offer.delete({
     *   where: {
     *     // ... filter to delete one Offer
     *   }
     * })
     *
     */
    delete<T extends OfferDeleteArgs>(
      args: SelectSubset<T, OfferDeleteArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Offer.
     * @param {OfferUpdateArgs} args - Arguments to update one Offer.
     * @example
     * // Update one Offer
     * const offer = await prisma.offer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OfferUpdateArgs>(
      args: SelectSubset<T, OfferUpdateArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Offers.
     * @param {OfferDeleteManyArgs} args - Arguments to filter Offers to delete.
     * @example
     * // Delete a few Offers
     * const { count } = await prisma.offer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OfferDeleteManyArgs>(
      args?: SelectSubset<T, OfferDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Offers
     * const offer = await prisma.offer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OfferUpdateManyArgs>(
      args: SelectSubset<T, OfferUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Offers and returns the data updated in the database.
     * @param {OfferUpdateManyAndReturnArgs} args - Arguments to update many Offers.
     * @example
     * // Update many Offers
     * const offer = await prisma.offer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Offers and only return the `id`
     * const offerWithIdOnly = await prisma.offer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OfferUpdateManyAndReturnArgs>(
      args: SelectSubset<T, OfferUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Create or update one Offer.
     * @param {OfferUpsertArgs} args - Arguments to update or create a Offer.
     * @example
     * // Update or create a Offer
     * const offer = await prisma.offer.upsert({
     *   create: {
     *     // ... data to create a Offer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Offer we want to update
     *   }
     * })
     */
    upsert<T extends OfferUpsertArgs>(
      args: SelectSubset<T, OfferUpsertArgs<ExtArgs>>,
    ): Prisma__OfferClient<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferCountArgs} args - Arguments to filter Offers to count.
     * @example
     * // Count the number of Offers
     * const count = await prisma.offer.count({
     *   where: {
     *     // ... the filter for the Offers we want to count
     *   }
     * })
     **/
    count<T extends OfferCountArgs>(
      args?: Subset<T, OfferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], OfferCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Offer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends OfferAggregateArgs>(
      args: Subset<T, OfferAggregateArgs>,
    ): Prisma.PrismaPromise<GetOfferAggregateType<T>>;

    /**
     * Group by Offer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends OfferGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: OfferGroupByArgs["orderBy"] }
        : { orderBy?: OfferGroupByArgs["orderBy"] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T["by"] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, OfferGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetOfferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Offer model
     */
    readonly fields: OfferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Offer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OfferClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    bookings<T extends Offer$bookingsArgs<ExtArgs> = {}>(
      args?: Subset<T, Offer$bookingsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    favorites<T extends Offer$favoritesArgs<ExtArgs> = {}>(
      args?: Subset<T, Offer$favoritesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    destination<T extends DestinationDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, DestinationDefaultArgs<ExtArgs>>,
    ): Prisma__DestinationClient<
      | $Result.GetResult<
          Prisma.$DestinationPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Offer model
   */
  interface OfferFieldRefs {
    readonly id: FieldRef<"Offer", "String">;
    readonly type: FieldRef<"Offer", "OfferType">;
    readonly destinationId: FieldRef<"Offer", "String">;
    readonly ownerId: FieldRef<"Offer", "String">;
    readonly title: FieldRef<"Offer", "String">;
    readonly description: FieldRef<"Offer", "String">;
    readonly price: FieldRef<"Offer", "Decimal">;
    readonly currency: FieldRef<"Offer", "Currency">;
    readonly maxGuests: FieldRef<"Offer", "Int">;
    readonly maxConcurrentBookings: FieldRef<"Offer", "Int">;
    readonly availableFrom: FieldRef<"Offer", "DateTime">;
    readonly availableTo: FieldRef<"Offer", "DateTime">;
    readonly status: FieldRef<"Offer", "OfferStatus">;
    readonly stars: FieldRef<"Offer", "Int">;
    readonly address: FieldRef<"Offer", "String">;
    readonly flightNumber: FieldRef<"Offer", "String">;
    readonly airline: FieldRef<"Offer", "String">;
    readonly durationDays: FieldRef<"Offer", "Int">;
    readonly includesMeals: FieldRef<"Offer", "Boolean">;
    readonly createdAt: FieldRef<"Offer", "DateTime">;
    readonly updatedAt: FieldRef<"Offer", "DateTime">;
    readonly deletedAt: FieldRef<"Offer", "DateTime">;
  }

  // Custom InputTypes
  /**
   * Offer findUnique
   */
  export type OfferFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where: OfferWhereUniqueInput;
  };

  /**
   * Offer findUniqueOrThrow
   */
  export type OfferFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where: OfferWhereUniqueInput;
  };

  /**
   * Offer findFirst
   */
  export type OfferFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where?: OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Offers.
     */
    cursor?: OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: OfferScalarFieldEnum | OfferScalarFieldEnum[];
  };

  /**
   * Offer findFirstOrThrow
   */
  export type OfferFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where?: OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Offers.
     */
    cursor?: OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: OfferScalarFieldEnum | OfferScalarFieldEnum[];
  };

  /**
   * Offer findMany
   */
  export type OfferFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offers to fetch.
     */
    where?: OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Offers.
     */
    cursor?: OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: OfferScalarFieldEnum | OfferScalarFieldEnum[];
  };

  /**
   * Offer create
   */
  export type OfferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
      /**
       * The data needed to create a Offer.
       */
      data: XOR<OfferCreateInput, OfferUncheckedCreateInput>;
    };

  /**
   * Offer createMany
   */
  export type OfferCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Offers.
     */
    data: OfferCreateManyInput | OfferCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Offer createManyAndReturn
   */
  export type OfferCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * The data used to create many Offers.
     */
    data: OfferCreateManyInput | OfferCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Offer update
   */
  export type OfferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
      /**
       * The data needed to update a Offer.
       */
      data: XOR<OfferUpdateInput, OfferUncheckedUpdateInput>;
      /**
       * Choose, which Offer to update.
       */
      where: OfferWhereUniqueInput;
    };

  /**
   * Offer updateMany
   */
  export type OfferUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Offers.
     */
    data: XOR<OfferUpdateManyMutationInput, OfferUncheckedUpdateManyInput>;
    /**
     * Filter which Offers to update
     */
    where?: OfferWhereInput;
    /**
     * Limit how many Offers to update.
     */
    limit?: number;
  };

  /**
   * Offer updateManyAndReturn
   */
  export type OfferUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: OfferSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: OfferOmit<ExtArgs> | null;
    /**
     * The data used to update Offers.
     */
    data: XOR<OfferUpdateManyMutationInput, OfferUncheckedUpdateManyInput>;
    /**
     * Filter which Offers to update
     */
    where?: OfferWhereInput;
    /**
     * Limit how many Offers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OfferIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Offer upsert
   */
  export type OfferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
      /**
       * The filter to search for the Offer to update in case it exists.
       */
      where: OfferWhereUniqueInput;
      /**
       * In case the Offer found by the `where` argument doesn't exist, create a new Offer with this data.
       */
      create: XOR<OfferCreateInput, OfferUncheckedCreateInput>;
      /**
       * In case the Offer was found with the provided `where` argument, update it with this data.
       */
      update: XOR<OfferUpdateInput, OfferUncheckedUpdateInput>;
    };

  /**
   * Offer delete
   */
  export type OfferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
      /**
       * Filter which Offer to delete.
       */
      where: OfferWhereUniqueInput;
    };

  /**
   * Offer deleteMany
   */
  export type OfferDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Offers to delete
     */
    where?: OfferWhereInput;
    /**
     * Limit how many Offers to delete.
     */
    limit?: number;
  };

  /**
   * Offer.bookings
   */
  export type Offer$bookingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    where?: BookingWhereInput;
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    cursor?: BookingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[];
  };

  /**
   * Offer.favorites
   */
  export type Offer$favoritesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    where?: FavoriteWhereInput;
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    cursor?: FavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FavoriteScalarFieldEnum | FavoriteScalarFieldEnum[];
  };

  /**
   * Offer without action
   */
  export type OfferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
    };

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    username: number;
    email: number;
    passwordHash: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: UserWhereInput;
      orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
    };

  export type UserGroupByOutputType = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T["by"]> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        username?: boolean;
        email?: boolean;
        passwordHash?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        bookings?: boolean | User$bookingsArgs<ExtArgs>;
        favorites?: boolean | User$favoritesArgs<ExtArgs>;
        offers?: boolean | User$offersArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs["result"]["user"]
    >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      email?: boolean;
      passwordHash?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["user"]
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      email?: boolean;
      passwordHash?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs["result"]["user"]
  >;

  export type UserSelectScalar = {
    id?: boolean;
    username?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      "id" | "username" | "email" | "passwordHash" | "createdAt" | "updatedAt",
      ExtArgs["result"]["user"]
    >;
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | User$bookingsArgs<ExtArgs>;
    favorites?: boolean | User$favoritesArgs<ExtArgs>;
    offers?: boolean | User$offersArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User";
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[];
      favorites: Prisma.$FavoritePayload<ExtArgs>[];
      offers: Prisma.$OfferPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        username: string;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs["result"]["user"]
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["model"]["User"]; meta: { name: "User" } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<"skip", Keys<T>>, Extends<"take", Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs["orderBy"] }
        : { orderBy?: UserGroupByArgs["orderBy"] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T["orderBy"]>>>,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T["by"] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, "Field ", P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    bookings<T extends User$bookingsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$bookingsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    favorites<T extends User$favoritesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$favoritesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$FavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    offers<T extends User$offersArgs<ExtArgs> = {}>(
      args?: Subset<T, User$offersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", "String">;
    readonly username: FieldRef<"User", "String">;
    readonly email: FieldRef<"User", "String">;
    readonly passwordHash: FieldRef<"User", "String">;
    readonly createdAt: FieldRef<"User", "DateTime">;
    readonly updatedAt: FieldRef<"User", "DateTime">;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Users.
       */
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.bookings
   */
  export type User$bookingsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null;
    where?: BookingWhereInput;
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[];
    cursor?: BookingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[];
  };

  /**
   * User.favorites
   */
  export type User$favoritesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Favorite
     */
    select?: FavoriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Favorite
     */
    omit?: FavoriteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FavoriteInclude<ExtArgs> | null;
    where?: FavoriteWhereInput;
    orderBy?: FavoriteOrderByWithRelationInput | FavoriteOrderByWithRelationInput[];
    cursor?: FavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FavoriteScalarFieldEnum | FavoriteScalarFieldEnum[];
  };

  /**
   * User.offers
   */
  export type User$offersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Offer
       */
      select?: OfferSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Offer
       */
      omit?: OfferOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OfferInclude<ExtArgs> | null;
      where?: OfferWhereInput;
      orderBy?: OfferOrderByWithRelationInput | OfferOrderByWithRelationInput[];
      cursor?: OfferWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: OfferScalarFieldEnum | OfferScalarFieldEnum[];
    };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
    };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: "ReadUncommitted";
    ReadCommitted: "ReadCommitted";
    RepeatableRead: "RepeatableRead";
    Serializable: "Serializable";
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const BookingScalarFieldEnum: {
    id: "id";
    userId: "userId";
    offerId: "offerId";
    startDate: "startDate";
    endDate: "endDate";
    guestsCount: "guestsCount";
    totalPrice: "totalPrice";
    status: "status";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type BookingScalarFieldEnum =
    (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];

  export const DestinationScalarFieldEnum: {
    id: "id";
    name: "name";
    countryCode: "countryCode";
    description: "description";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type DestinationScalarFieldEnum =
    (typeof DestinationScalarFieldEnum)[keyof typeof DestinationScalarFieldEnum];

  export const FavoriteScalarFieldEnum: {
    id: "id";
    userId: "userId";
    offerId: "offerId";
    createdAt: "createdAt";
  };

  export type FavoriteScalarFieldEnum =
    (typeof FavoriteScalarFieldEnum)[keyof typeof FavoriteScalarFieldEnum];

  export const OfferScalarFieldEnum: {
    id: "id";
    type: "type";
    destinationId: "destinationId";
    ownerId: "ownerId";
    title: "title";
    description: "description";
    price: "price";
    currency: "currency";
    maxGuests: "maxGuests";
    maxConcurrentBookings: "maxConcurrentBookings";
    availableFrom: "availableFrom";
    availableTo: "availableTo";
    status: "status";
    stars: "stars";
    address: "address";
    flightNumber: "flightNumber";
    airline: "airline";
    durationDays: "durationDays";
    includesMeals: "includesMeals";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
    deletedAt: "deletedAt";
  };

  export type OfferScalarFieldEnum =
    (typeof OfferScalarFieldEnum)[keyof typeof OfferScalarFieldEnum];

  export const UserScalarFieldEnum: {
    id: "id";
    username: "username";
    email: "email";
    passwordHash: "passwordHash";
    createdAt: "createdAt";
    updatedAt: "updatedAt";
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const SortOrder: {
    asc: "asc";
    desc: "desc";
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: "default";
    insensitive: "insensitive";
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: "first";
    last: "last";
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String">;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "String[]">;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "DateTime">;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "DateTime[]"
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int">;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Int[]">;

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Decimal">;

  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Decimal[]">;

  /**
   * Reference to a field of type 'BookingStatus'
   */
  export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "BookingStatus"
  >;

  /**
   * Reference to a field of type 'BookingStatus[]'
   */
  export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "BookingStatus[]"
  >;

  /**
   * Reference to a field of type 'OfferType'
   */
  export type EnumOfferTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "OfferType"
  >;

  /**
   * Reference to a field of type 'OfferType[]'
   */
  export type ListEnumOfferTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "OfferType[]"
  >;

  /**
   * Reference to a field of type 'Currency'
   */
  export type EnumCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Currency">;

  /**
   * Reference to a field of type 'Currency[]'
   */
  export type ListEnumCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Currency[]"
  >;

  /**
   * Reference to a field of type 'OfferStatus'
   */
  export type EnumOfferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "OfferStatus"
  >;

  /**
   * Reference to a field of type 'OfferStatus[]'
   */
  export type ListEnumOfferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "OfferStatus[]"
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Boolean">;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float">;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, "Float[]">;

  /**
   * Deep Input Types
   */

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[];
    OR?: BookingWhereInput[];
    NOT?: BookingWhereInput | BookingWhereInput[];
    id?: StringFilter<"Booking"> | string;
    userId?: StringFilter<"Booking"> | string;
    offerId?: StringFilter<"Booking"> | string;
    startDate?: DateTimeFilter<"Booking"> | Date | string;
    endDate?: DateTimeFilter<"Booking"> | Date | string;
    guestsCount?: IntFilter<"Booking"> | number;
    totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
    createdAt?: DateTimeFilter<"Booking"> | Date | string;
    updatedAt?: DateTimeFilter<"Booking"> | Date | string;
    offer?: XOR<OfferScalarRelationFilter, OfferWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    offer?: OfferOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };

  export type BookingWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: BookingWhereInput | BookingWhereInput[];
      OR?: BookingWhereInput[];
      NOT?: BookingWhereInput | BookingWhereInput[];
      userId?: StringFilter<"Booking"> | string;
      offerId?: StringFilter<"Booking"> | string;
      startDate?: DateTimeFilter<"Booking"> | Date | string;
      endDate?: DateTimeFilter<"Booking"> | Date | string;
      guestsCount?: IntFilter<"Booking"> | number;
      totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string;
      status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
      createdAt?: DateTimeFilter<"Booking"> | Date | string;
      updatedAt?: DateTimeFilter<"Booking"> | Date | string;
      offer?: XOR<OfferScalarRelationFilter, OfferWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    "id"
  >;

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: BookingCountOrderByAggregateInput;
    _avg?: BookingAvgOrderByAggregateInput;
    _max?: BookingMaxOrderByAggregateInput;
    _min?: BookingMinOrderByAggregateInput;
    _sum?: BookingSumOrderByAggregateInput;
  };

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[];
    OR?: BookingScalarWhereWithAggregatesInput[];
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Booking"> | string;
    userId?: StringWithAggregatesFilter<"Booking"> | string;
    offerId?: StringWithAggregatesFilter<"Booking"> | string;
    startDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    endDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    guestsCount?: IntWithAggregatesFilter<"Booking"> | number;
    totalPrice?: DecimalWithAggregatesFilter<"Booking"> | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus;
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string;
  };

  export type DestinationWhereInput = {
    AND?: DestinationWhereInput | DestinationWhereInput[];
    OR?: DestinationWhereInput[];
    NOT?: DestinationWhereInput | DestinationWhereInput[];
    id?: StringFilter<"Destination"> | string;
    name?: StringFilter<"Destination"> | string;
    countryCode?: StringFilter<"Destination"> | string;
    description?: StringNullableFilter<"Destination"> | string | null;
    createdAt?: DateTimeFilter<"Destination"> | Date | string;
    updatedAt?: DateTimeFilter<"Destination"> | Date | string;
    offers?: OfferListRelationFilter;
  };

  export type DestinationOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    countryCode?: SortOrder;
    description?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    offers?: OfferOrderByRelationAggregateInput;
  };

  export type DestinationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: DestinationWhereInput | DestinationWhereInput[];
      OR?: DestinationWhereInput[];
      NOT?: DestinationWhereInput | DestinationWhereInput[];
      name?: StringFilter<"Destination"> | string;
      countryCode?: StringFilter<"Destination"> | string;
      description?: StringNullableFilter<"Destination"> | string | null;
      createdAt?: DateTimeFilter<"Destination"> | Date | string;
      updatedAt?: DateTimeFilter<"Destination"> | Date | string;
      offers?: OfferListRelationFilter;
    },
    "id"
  >;

  export type DestinationOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    countryCode?: SortOrder;
    description?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: DestinationCountOrderByAggregateInput;
    _max?: DestinationMaxOrderByAggregateInput;
    _min?: DestinationMinOrderByAggregateInput;
  };

  export type DestinationScalarWhereWithAggregatesInput = {
    AND?: DestinationScalarWhereWithAggregatesInput | DestinationScalarWhereWithAggregatesInput[];
    OR?: DestinationScalarWhereWithAggregatesInput[];
    NOT?: DestinationScalarWhereWithAggregatesInput | DestinationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Destination"> | string;
    name?: StringWithAggregatesFilter<"Destination"> | string;
    countryCode?: StringWithAggregatesFilter<"Destination"> | string;
    description?: StringNullableWithAggregatesFilter<"Destination"> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<"Destination"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Destination"> | Date | string;
  };

  export type FavoriteWhereInput = {
    AND?: FavoriteWhereInput | FavoriteWhereInput[];
    OR?: FavoriteWhereInput[];
    NOT?: FavoriteWhereInput | FavoriteWhereInput[];
    id?: StringFilter<"Favorite"> | string;
    userId?: StringFilter<"Favorite"> | string;
    offerId?: StringFilter<"Favorite"> | string;
    createdAt?: DateTimeFilter<"Favorite"> | Date | string;
    offer?: XOR<OfferScalarRelationFilter, OfferWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type FavoriteOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    createdAt?: SortOrder;
    offer?: OfferOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };

  export type FavoriteWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_offerId?: FavoriteUserIdOfferIdCompoundUniqueInput;
      AND?: FavoriteWhereInput | FavoriteWhereInput[];
      OR?: FavoriteWhereInput[];
      NOT?: FavoriteWhereInput | FavoriteWhereInput[];
      userId?: StringFilter<"Favorite"> | string;
      offerId?: StringFilter<"Favorite"> | string;
      createdAt?: DateTimeFilter<"Favorite"> | Date | string;
      offer?: XOR<OfferScalarRelationFilter, OfferWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    "id" | "userId_offerId"
  >;

  export type FavoriteOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    createdAt?: SortOrder;
    _count?: FavoriteCountOrderByAggregateInput;
    _max?: FavoriteMaxOrderByAggregateInput;
    _min?: FavoriteMinOrderByAggregateInput;
  };

  export type FavoriteScalarWhereWithAggregatesInput = {
    AND?: FavoriteScalarWhereWithAggregatesInput | FavoriteScalarWhereWithAggregatesInput[];
    OR?: FavoriteScalarWhereWithAggregatesInput[];
    NOT?: FavoriteScalarWhereWithAggregatesInput | FavoriteScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Favorite"> | string;
    userId?: StringWithAggregatesFilter<"Favorite"> | string;
    offerId?: StringWithAggregatesFilter<"Favorite"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"Favorite"> | Date | string;
  };

  export type OfferWhereInput = {
    AND?: OfferWhereInput | OfferWhereInput[];
    OR?: OfferWhereInput[];
    NOT?: OfferWhereInput | OfferWhereInput[];
    id?: StringFilter<"Offer"> | string;
    type?: EnumOfferTypeFilter<"Offer"> | $Enums.OfferType;
    destinationId?: StringFilter<"Offer"> | string;
    ownerId?: StringFilter<"Offer"> | string;
    title?: StringFilter<"Offer"> | string;
    description?: StringNullableFilter<"Offer"> | string | null;
    price?: DecimalFilter<"Offer"> | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFilter<"Offer"> | $Enums.Currency;
    maxGuests?: IntFilter<"Offer"> | number;
    maxConcurrentBookings?: IntFilter<"Offer"> | number;
    availableFrom?: DateTimeFilter<"Offer"> | Date | string;
    availableTo?: DateTimeFilter<"Offer"> | Date | string;
    status?: EnumOfferStatusFilter<"Offer"> | $Enums.OfferStatus;
    stars?: IntNullableFilter<"Offer"> | number | null;
    address?: StringNullableFilter<"Offer"> | string | null;
    flightNumber?: StringNullableFilter<"Offer"> | string | null;
    airline?: StringNullableFilter<"Offer"> | string | null;
    durationDays?: IntNullableFilter<"Offer"> | number | null;
    includesMeals?: BoolNullableFilter<"Offer"> | boolean | null;
    createdAt?: DateTimeFilter<"Offer"> | Date | string;
    updatedAt?: DateTimeFilter<"Offer"> | Date | string;
    deletedAt?: DateTimeNullableFilter<"Offer"> | Date | string | null;
    bookings?: BookingListRelationFilter;
    favorites?: FavoriteListRelationFilter;
    destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type OfferOrderByWithRelationInput = {
    id?: SortOrder;
    type?: SortOrder;
    destinationId?: SortOrder;
    ownerId?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    price?: SortOrder;
    currency?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    availableFrom?: SortOrder;
    availableTo?: SortOrder;
    status?: SortOrder;
    stars?: SortOrderInput | SortOrder;
    address?: SortOrderInput | SortOrder;
    flightNumber?: SortOrderInput | SortOrder;
    airline?: SortOrderInput | SortOrder;
    durationDays?: SortOrderInput | SortOrder;
    includesMeals?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    bookings?: BookingOrderByRelationAggregateInput;
    favorites?: FavoriteOrderByRelationAggregateInput;
    destination?: DestinationOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };

  export type OfferWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: OfferWhereInput | OfferWhereInput[];
      OR?: OfferWhereInput[];
      NOT?: OfferWhereInput | OfferWhereInput[];
      type?: EnumOfferTypeFilter<"Offer"> | $Enums.OfferType;
      destinationId?: StringFilter<"Offer"> | string;
      ownerId?: StringFilter<"Offer"> | string;
      title?: StringFilter<"Offer"> | string;
      description?: StringNullableFilter<"Offer"> | string | null;
      price?: DecimalFilter<"Offer"> | Decimal | DecimalJsLike | number | string;
      currency?: EnumCurrencyFilter<"Offer"> | $Enums.Currency;
      maxGuests?: IntFilter<"Offer"> | number;
      maxConcurrentBookings?: IntFilter<"Offer"> | number;
      availableFrom?: DateTimeFilter<"Offer"> | Date | string;
      availableTo?: DateTimeFilter<"Offer"> | Date | string;
      status?: EnumOfferStatusFilter<"Offer"> | $Enums.OfferStatus;
      stars?: IntNullableFilter<"Offer"> | number | null;
      address?: StringNullableFilter<"Offer"> | string | null;
      flightNumber?: StringNullableFilter<"Offer"> | string | null;
      airline?: StringNullableFilter<"Offer"> | string | null;
      durationDays?: IntNullableFilter<"Offer"> | number | null;
      includesMeals?: BoolNullableFilter<"Offer"> | boolean | null;
      createdAt?: DateTimeFilter<"Offer"> | Date | string;
      updatedAt?: DateTimeFilter<"Offer"> | Date | string;
      deletedAt?: DateTimeNullableFilter<"Offer"> | Date | string | null;
      bookings?: BookingListRelationFilter;
      favorites?: FavoriteListRelationFilter;
      destination?: XOR<DestinationScalarRelationFilter, DestinationWhereInput>;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    "id"
  >;

  export type OfferOrderByWithAggregationInput = {
    id?: SortOrder;
    type?: SortOrder;
    destinationId?: SortOrder;
    ownerId?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    price?: SortOrder;
    currency?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    availableFrom?: SortOrder;
    availableTo?: SortOrder;
    status?: SortOrder;
    stars?: SortOrderInput | SortOrder;
    address?: SortOrderInput | SortOrder;
    flightNumber?: SortOrderInput | SortOrder;
    airline?: SortOrderInput | SortOrder;
    durationDays?: SortOrderInput | SortOrder;
    includesMeals?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: OfferCountOrderByAggregateInput;
    _avg?: OfferAvgOrderByAggregateInput;
    _max?: OfferMaxOrderByAggregateInput;
    _min?: OfferMinOrderByAggregateInput;
    _sum?: OfferSumOrderByAggregateInput;
  };

  export type OfferScalarWhereWithAggregatesInput = {
    AND?: OfferScalarWhereWithAggregatesInput | OfferScalarWhereWithAggregatesInput[];
    OR?: OfferScalarWhereWithAggregatesInput[];
    NOT?: OfferScalarWhereWithAggregatesInput | OfferScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"Offer"> | string;
    type?: EnumOfferTypeWithAggregatesFilter<"Offer"> | $Enums.OfferType;
    destinationId?: StringWithAggregatesFilter<"Offer"> | string;
    ownerId?: StringWithAggregatesFilter<"Offer"> | string;
    title?: StringWithAggregatesFilter<"Offer"> | string;
    description?: StringNullableWithAggregatesFilter<"Offer"> | string | null;
    price?: DecimalWithAggregatesFilter<"Offer"> | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyWithAggregatesFilter<"Offer"> | $Enums.Currency;
    maxGuests?: IntWithAggregatesFilter<"Offer"> | number;
    maxConcurrentBookings?: IntWithAggregatesFilter<"Offer"> | number;
    availableFrom?: DateTimeWithAggregatesFilter<"Offer"> | Date | string;
    availableTo?: DateTimeWithAggregatesFilter<"Offer"> | Date | string;
    status?: EnumOfferStatusWithAggregatesFilter<"Offer"> | $Enums.OfferStatus;
    stars?: IntNullableWithAggregatesFilter<"Offer"> | number | null;
    address?: StringNullableWithAggregatesFilter<"Offer"> | string | null;
    flightNumber?: StringNullableWithAggregatesFilter<"Offer"> | string | null;
    airline?: StringNullableWithAggregatesFilter<"Offer"> | string | null;
    durationDays?: IntNullableWithAggregatesFilter<"Offer"> | number | null;
    includesMeals?: BoolNullableWithAggregatesFilter<"Offer"> | boolean | null;
    createdAt?: DateTimeWithAggregatesFilter<"Offer"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"Offer"> | Date | string;
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Offer"> | Date | string | null;
  };

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<"User"> | string;
    username?: StringFilter<"User"> | string;
    email?: StringFilter<"User"> | string;
    passwordHash?: StringFilter<"User"> | string;
    createdAt?: DateTimeFilter<"User"> | Date | string;
    updatedAt?: DateTimeFilter<"User"> | Date | string;
    bookings?: BookingListRelationFilter;
    favorites?: FavoriteListRelationFilter;
    offers?: OfferListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    passwordHash?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    bookings?: BookingOrderByRelationAggregateInput;
    favorites?: FavoriteOrderByRelationAggregateInput;
    offers?: OfferOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      username?: StringFilter<"User"> | string;
      passwordHash?: StringFilter<"User"> | string;
      createdAt?: DateTimeFilter<"User"> | Date | string;
      updatedAt?: DateTimeFilter<"User"> | Date | string;
      bookings?: BookingListRelationFilter;
      favorites?: FavoriteListRelationFilter;
      offers?: OfferListRelationFilter;
    },
    "id" | "email"
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    passwordHash?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<"User"> | string;
    username?: StringWithAggregatesFilter<"User"> | string;
    email?: StringWithAggregatesFilter<"User"> | string;
    passwordHash?: StringWithAggregatesFilter<"User"> | string;
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string;
  };

  export type BookingCreateInput = {
    id?: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    offer: OfferCreateNestedOneWithoutBookingsInput;
    user: UserCreateNestedOneWithoutBookingsInput;
  };

  export type BookingUncheckedCreateInput = {
    id?: string;
    userId: string;
    offerId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offer?: OfferUpdateOneRequiredWithoutBookingsNestedInput;
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput;
  };

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BookingCreateManyInput = {
    id?: string;
    userId: string;
    offerId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type DestinationCreateInput = {
    id?: string;
    name: string;
    countryCode: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    offers?: OfferCreateNestedManyWithoutDestinationInput;
  };

  export type DestinationUncheckedCreateInput = {
    id?: string;
    name: string;
    countryCode: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    offers?: OfferUncheckedCreateNestedManyWithoutDestinationInput;
  };

  export type DestinationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offers?: OfferUpdateManyWithoutDestinationNestedInput;
  };

  export type DestinationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offers?: OfferUncheckedUpdateManyWithoutDestinationNestedInput;
  };

  export type DestinationCreateManyInput = {
    id?: string;
    name: string;
    countryCode: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type DestinationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type DestinationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteCreateInput = {
    id?: string;
    createdAt?: Date | string;
    offer: OfferCreateNestedOneWithoutFavoritesInput;
    user: UserCreateNestedOneWithoutFavoritesInput;
  };

  export type FavoriteUncheckedCreateInput = {
    id?: string;
    userId: string;
    offerId: string;
    createdAt?: Date | string;
  };

  export type FavoriteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offer?: OfferUpdateOneRequiredWithoutFavoritesNestedInput;
    user?: UserUpdateOneRequiredWithoutFavoritesNestedInput;
  };

  export type FavoriteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteCreateManyInput = {
    id?: string;
    userId: string;
    offerId: string;
    createdAt?: Date | string;
  };

  export type FavoriteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OfferCreateInput = {
    id?: string;
    type: $Enums.OfferType;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteCreateNestedManyWithoutOfferInput;
    destination: DestinationCreateNestedOneWithoutOffersInput;
    user: UserCreateNestedOneWithoutOffersInput;
  };

  export type OfferUncheckedCreateInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingUncheckedCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutOfferInput;
  };

  export type OfferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUpdateManyWithoutOfferNestedInput;
    destination?: DestinationUpdateOneRequiredWithoutOffersNestedInput;
    user?: UserUpdateOneRequiredWithoutOffersNestedInput;
  };

  export type OfferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUncheckedUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUncheckedUpdateManyWithoutOfferNestedInput;
  };

  export type OfferCreateManyInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type OfferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
  };

  export type OfferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
  };

  export type UserCreateInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingCreateNestedManyWithoutUserInput;
    favorites?: FavoriteCreateNestedManyWithoutUserInput;
    offers?: OfferCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutUserInput;
    offers?: OfferUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUpdateManyWithoutUserNestedInput;
    favorites?: FavoriteUpdateManyWithoutUserNestedInput;
    offers?: OfferUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput;
    favorites?: FavoriteUncheckedUpdateManyWithoutUserNestedInput;
    offers?: OfferUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
  };

  export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
  };

  export type OfferScalarRelationFilter = {
    is?: OfferWhereInput;
    isNot?: OfferWhereInput;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BookingAvgOrderByAggregateInput = {
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
  };

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type BookingSumOrderByAggregateInput = {
    guestsCount?: SortOrder;
    totalPrice?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type OfferListRelationFilter = {
    every?: OfferWhereInput;
    some?: OfferWhereInput;
    none?: OfferWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type OfferOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type DestinationCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    countryCode?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type DestinationMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    countryCode?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type DestinationMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    countryCode?: SortOrder;
    description?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type FavoriteUserIdOfferIdCompoundUniqueInput = {
    userId: string;
    offerId: string;
  };

  export type FavoriteCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type FavoriteMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type FavoriteMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    offerId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumOfferTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferType | EnumOfferTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferTypeFilter<$PrismaModel> | $Enums.OfferType;
  };

  export type EnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
  };

  export type EnumOfferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferStatus | EnumOfferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferStatusFilter<$PrismaModel> | $Enums.OfferStatus;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type BookingListRelationFilter = {
    every?: BookingWhereInput;
    some?: BookingWhereInput;
    none?: BookingWhereInput;
  };

  export type FavoriteListRelationFilter = {
    every?: FavoriteWhereInput;
    some?: FavoriteWhereInput;
    none?: FavoriteWhereInput;
  };

  export type DestinationScalarRelationFilter = {
    is?: DestinationWhereInput;
    isNot?: DestinationWhereInput;
  };

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type FavoriteOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type OfferCountOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    destinationId?: SortOrder;
    ownerId?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    currency?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    availableFrom?: SortOrder;
    availableTo?: SortOrder;
    status?: SortOrder;
    stars?: SortOrder;
    address?: SortOrder;
    flightNumber?: SortOrder;
    airline?: SortOrder;
    durationDays?: SortOrder;
    includesMeals?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type OfferAvgOrderByAggregateInput = {
    price?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    stars?: SortOrder;
    durationDays?: SortOrder;
  };

  export type OfferMaxOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    destinationId?: SortOrder;
    ownerId?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    currency?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    availableFrom?: SortOrder;
    availableTo?: SortOrder;
    status?: SortOrder;
    stars?: SortOrder;
    address?: SortOrder;
    flightNumber?: SortOrder;
    airline?: SortOrder;
    durationDays?: SortOrder;
    includesMeals?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type OfferMinOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    destinationId?: SortOrder;
    ownerId?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    currency?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    availableFrom?: SortOrder;
    availableTo?: SortOrder;
    status?: SortOrder;
    stars?: SortOrder;
    address?: SortOrder;
    flightNumber?: SortOrder;
    airline?: SortOrder;
    durationDays?: SortOrder;
    includesMeals?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type OfferSumOrderByAggregateInput = {
    price?: SortOrder;
    maxGuests?: SortOrder;
    maxConcurrentBookings?: SortOrder;
    stars?: SortOrder;
    durationDays?: SortOrder;
  };

  export type EnumOfferTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferType | EnumOfferTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferTypeWithAggregatesFilter<$PrismaModel> | $Enums.OfferType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumOfferTypeFilter<$PrismaModel>;
    _max?: NestedEnumOfferTypeFilter<$PrismaModel>;
  };

  export type EnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumCurrencyFilter<$PrismaModel>;
    _max?: NestedEnumCurrencyFilter<$PrismaModel>;
  };

  export type EnumOfferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferStatus | EnumOfferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferStatusWithAggregatesFilter<$PrismaModel> | $Enums.OfferStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumOfferStatusFilter<$PrismaModel>;
    _max?: NestedEnumOfferStatusFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    passwordHash?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    passwordHash?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    passwordHash?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type OfferCreateNestedOneWithoutBookingsInput = {
    create?: XOR<OfferCreateWithoutBookingsInput, OfferUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: OfferCreateOrConnectWithoutBookingsInput;
    connect?: OfferWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutBookingsInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput;
    connect?: UserWhereUniqueInput;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string;
    increment?: Decimal | DecimalJsLike | number | string;
    decrement?: Decimal | DecimalJsLike | number | string;
    multiply?: Decimal | DecimalJsLike | number | string;
    divide?: Decimal | DecimalJsLike | number | string;
  };

  export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus;
  };

  export type OfferUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<OfferCreateWithoutBookingsInput, OfferUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: OfferCreateOrConnectWithoutBookingsInput;
    upsert?: OfferUpsertWithoutBookingsInput;
    connect?: OfferWhereUniqueInput;
    update?: XOR<
      XOR<OfferUpdateToOneWithWhereWithoutBookingsInput, OfferUpdateWithoutBookingsInput>,
      OfferUncheckedUpdateWithoutBookingsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput;
    upsert?: UserUpsertWithoutBookingsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutBookingsInput, UserUpdateWithoutBookingsInput>,
      UserUncheckedUpdateWithoutBookingsInput
    >;
  };

  export type OfferCreateNestedManyWithoutDestinationInput = {
    create?:
      | XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>
      | OfferCreateWithoutDestinationInput[]
      | OfferUncheckedCreateWithoutDestinationInput[];
    connectOrCreate?:
      | OfferCreateOrConnectWithoutDestinationInput
      | OfferCreateOrConnectWithoutDestinationInput[];
    createMany?: OfferCreateManyDestinationInputEnvelope;
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
  };

  export type OfferUncheckedCreateNestedManyWithoutDestinationInput = {
    create?:
      | XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>
      | OfferCreateWithoutDestinationInput[]
      | OfferUncheckedCreateWithoutDestinationInput[];
    connectOrCreate?:
      | OfferCreateOrConnectWithoutDestinationInput
      | OfferCreateOrConnectWithoutDestinationInput[];
    createMany?: OfferCreateManyDestinationInputEnvelope;
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type OfferUpdateManyWithoutDestinationNestedInput = {
    create?:
      | XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>
      | OfferCreateWithoutDestinationInput[]
      | OfferUncheckedCreateWithoutDestinationInput[];
    connectOrCreate?:
      | OfferCreateOrConnectWithoutDestinationInput
      | OfferCreateOrConnectWithoutDestinationInput[];
    upsert?:
      | OfferUpsertWithWhereUniqueWithoutDestinationInput
      | OfferUpsertWithWhereUniqueWithoutDestinationInput[];
    createMany?: OfferCreateManyDestinationInputEnvelope;
    set?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    disconnect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    delete?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    update?:
      | OfferUpdateWithWhereUniqueWithoutDestinationInput
      | OfferUpdateWithWhereUniqueWithoutDestinationInput[];
    updateMany?:
      | OfferUpdateManyWithWhereWithoutDestinationInput
      | OfferUpdateManyWithWhereWithoutDestinationInput[];
    deleteMany?: OfferScalarWhereInput | OfferScalarWhereInput[];
  };

  export type OfferUncheckedUpdateManyWithoutDestinationNestedInput = {
    create?:
      | XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>
      | OfferCreateWithoutDestinationInput[]
      | OfferUncheckedCreateWithoutDestinationInput[];
    connectOrCreate?:
      | OfferCreateOrConnectWithoutDestinationInput
      | OfferCreateOrConnectWithoutDestinationInput[];
    upsert?:
      | OfferUpsertWithWhereUniqueWithoutDestinationInput
      | OfferUpsertWithWhereUniqueWithoutDestinationInput[];
    createMany?: OfferCreateManyDestinationInputEnvelope;
    set?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    disconnect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    delete?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    update?:
      | OfferUpdateWithWhereUniqueWithoutDestinationInput
      | OfferUpdateWithWhereUniqueWithoutDestinationInput[];
    updateMany?:
      | OfferUpdateManyWithWhereWithoutDestinationInput
      | OfferUpdateManyWithWhereWithoutDestinationInput[];
    deleteMany?: OfferScalarWhereInput | OfferScalarWhereInput[];
  };

  export type OfferCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<OfferCreateWithoutFavoritesInput, OfferUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: OfferCreateOrConnectWithoutFavoritesInput;
    connect?: OfferWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<UserCreateWithoutFavoritesInput, UserUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutFavoritesInput;
    connect?: UserWhereUniqueInput;
  };

  export type OfferUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<OfferCreateWithoutFavoritesInput, OfferUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: OfferCreateOrConnectWithoutFavoritesInput;
    upsert?: OfferUpsertWithoutFavoritesInput;
    connect?: OfferWhereUniqueInput;
    update?: XOR<
      XOR<OfferUpdateToOneWithWhereWithoutFavoritesInput, OfferUpdateWithoutFavoritesInput>,
      OfferUncheckedUpdateWithoutFavoritesInput
    >;
  };

  export type UserUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<UserCreateWithoutFavoritesInput, UserUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutFavoritesInput;
    upsert?: UserUpsertWithoutFavoritesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutFavoritesInput, UserUpdateWithoutFavoritesInput>,
      UserUncheckedUpdateWithoutFavoritesInput
    >;
  };

  export type BookingCreateNestedManyWithoutOfferInput = {
    create?:
      | XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>
      | BookingCreateWithoutOfferInput[]
      | BookingUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutOfferInput
      | BookingCreateOrConnectWithoutOfferInput[];
    createMany?: BookingCreateManyOfferInputEnvelope;
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
  };

  export type FavoriteCreateNestedManyWithoutOfferInput = {
    create?:
      | XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>
      | FavoriteCreateWithoutOfferInput[]
      | FavoriteUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutOfferInput
      | FavoriteCreateOrConnectWithoutOfferInput[];
    createMany?: FavoriteCreateManyOfferInputEnvelope;
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
  };

  export type DestinationCreateNestedOneWithoutOffersInput = {
    create?: XOR<DestinationCreateWithoutOffersInput, DestinationUncheckedCreateWithoutOffersInput>;
    connectOrCreate?: DestinationCreateOrConnectWithoutOffersInput;
    connect?: DestinationWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutOffersInput = {
    create?: XOR<UserCreateWithoutOffersInput, UserUncheckedCreateWithoutOffersInput>;
    connectOrCreate?: UserCreateOrConnectWithoutOffersInput;
    connect?: UserWhereUniqueInput;
  };

  export type BookingUncheckedCreateNestedManyWithoutOfferInput = {
    create?:
      | XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>
      | BookingCreateWithoutOfferInput[]
      | BookingUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutOfferInput
      | BookingCreateOrConnectWithoutOfferInput[];
    createMany?: BookingCreateManyOfferInputEnvelope;
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
  };

  export type FavoriteUncheckedCreateNestedManyWithoutOfferInput = {
    create?:
      | XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>
      | FavoriteCreateWithoutOfferInput[]
      | FavoriteUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutOfferInput
      | FavoriteCreateOrConnectWithoutOfferInput[];
    createMany?: FavoriteCreateManyOfferInputEnvelope;
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
  };

  export type EnumOfferTypeFieldUpdateOperationsInput = {
    set?: $Enums.OfferType;
  };

  export type EnumCurrencyFieldUpdateOperationsInput = {
    set?: $Enums.Currency;
  };

  export type EnumOfferStatusFieldUpdateOperationsInput = {
    set?: $Enums.OfferStatus;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type BookingUpdateManyWithoutOfferNestedInput = {
    create?:
      | XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>
      | BookingCreateWithoutOfferInput[]
      | BookingUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutOfferInput
      | BookingCreateOrConnectWithoutOfferInput[];
    upsert?:
      | BookingUpsertWithWhereUniqueWithoutOfferInput
      | BookingUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: BookingCreateManyOfferInputEnvelope;
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    update?:
      | BookingUpdateWithWhereUniqueWithoutOfferInput
      | BookingUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?:
      | BookingUpdateManyWithWhereWithoutOfferInput
      | BookingUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[];
  };

  export type FavoriteUpdateManyWithoutOfferNestedInput = {
    create?:
      | XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>
      | FavoriteCreateWithoutOfferInput[]
      | FavoriteUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutOfferInput
      | FavoriteCreateOrConnectWithoutOfferInput[];
    upsert?:
      | FavoriteUpsertWithWhereUniqueWithoutOfferInput
      | FavoriteUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: FavoriteCreateManyOfferInputEnvelope;
    set?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    disconnect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    delete?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    update?:
      | FavoriteUpdateWithWhereUniqueWithoutOfferInput
      | FavoriteUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?:
      | FavoriteUpdateManyWithWhereWithoutOfferInput
      | FavoriteUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
  };

  export type DestinationUpdateOneRequiredWithoutOffersNestedInput = {
    create?: XOR<DestinationCreateWithoutOffersInput, DestinationUncheckedCreateWithoutOffersInput>;
    connectOrCreate?: DestinationCreateOrConnectWithoutOffersInput;
    upsert?: DestinationUpsertWithoutOffersInput;
    connect?: DestinationWhereUniqueInput;
    update?: XOR<
      XOR<DestinationUpdateToOneWithWhereWithoutOffersInput, DestinationUpdateWithoutOffersInput>,
      DestinationUncheckedUpdateWithoutOffersInput
    >;
  };

  export type UserUpdateOneRequiredWithoutOffersNestedInput = {
    create?: XOR<UserCreateWithoutOffersInput, UserUncheckedCreateWithoutOffersInput>;
    connectOrCreate?: UserCreateOrConnectWithoutOffersInput;
    upsert?: UserUpsertWithoutOffersInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutOffersInput, UserUpdateWithoutOffersInput>,
      UserUncheckedUpdateWithoutOffersInput
    >;
  };

  export type BookingUncheckedUpdateManyWithoutOfferNestedInput = {
    create?:
      | XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>
      | BookingCreateWithoutOfferInput[]
      | BookingUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutOfferInput
      | BookingCreateOrConnectWithoutOfferInput[];
    upsert?:
      | BookingUpsertWithWhereUniqueWithoutOfferInput
      | BookingUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: BookingCreateManyOfferInputEnvelope;
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    update?:
      | BookingUpdateWithWhereUniqueWithoutOfferInput
      | BookingUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?:
      | BookingUpdateManyWithWhereWithoutOfferInput
      | BookingUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[];
  };

  export type FavoriteUncheckedUpdateManyWithoutOfferNestedInput = {
    create?:
      | XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>
      | FavoriteCreateWithoutOfferInput[]
      | FavoriteUncheckedCreateWithoutOfferInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutOfferInput
      | FavoriteCreateOrConnectWithoutOfferInput[];
    upsert?:
      | FavoriteUpsertWithWhereUniqueWithoutOfferInput
      | FavoriteUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: FavoriteCreateManyOfferInputEnvelope;
    set?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    disconnect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    delete?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    update?:
      | FavoriteUpdateWithWhereUniqueWithoutOfferInput
      | FavoriteUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?:
      | FavoriteUpdateManyWithWhereWithoutOfferInput
      | FavoriteUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
  };

  export type BookingCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
      | BookingCreateWithoutUserInput[]
      | BookingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutUserInput
      | BookingCreateOrConnectWithoutUserInput[];
    createMany?: BookingCreateManyUserInputEnvelope;
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
  };

  export type FavoriteCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>
      | FavoriteCreateWithoutUserInput[]
      | FavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutUserInput
      | FavoriteCreateOrConnectWithoutUserInput[];
    createMany?: FavoriteCreateManyUserInputEnvelope;
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
  };

  export type OfferCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>
      | OfferCreateWithoutUserInput[]
      | OfferUncheckedCreateWithoutUserInput[];
    connectOrCreate?: OfferCreateOrConnectWithoutUserInput | OfferCreateOrConnectWithoutUserInput[];
    createMany?: OfferCreateManyUserInputEnvelope;
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
  };

  export type BookingUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
      | BookingCreateWithoutUserInput[]
      | BookingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutUserInput
      | BookingCreateOrConnectWithoutUserInput[];
    createMany?: BookingCreateManyUserInputEnvelope;
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
  };

  export type FavoriteUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>
      | FavoriteCreateWithoutUserInput[]
      | FavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutUserInput
      | FavoriteCreateOrConnectWithoutUserInput[];
    createMany?: FavoriteCreateManyUserInputEnvelope;
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
  };

  export type OfferUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>
      | OfferCreateWithoutUserInput[]
      | OfferUncheckedCreateWithoutUserInput[];
    connectOrCreate?: OfferCreateOrConnectWithoutUserInput | OfferCreateOrConnectWithoutUserInput[];
    createMany?: OfferCreateManyUserInputEnvelope;
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
  };

  export type BookingUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
      | BookingCreateWithoutUserInput[]
      | BookingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutUserInput
      | BookingCreateOrConnectWithoutUserInput[];
    upsert?:
      | BookingUpsertWithWhereUniqueWithoutUserInput
      | BookingUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: BookingCreateManyUserInputEnvelope;
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    update?:
      | BookingUpdateWithWhereUniqueWithoutUserInput
      | BookingUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | BookingUpdateManyWithWhereWithoutUserInput
      | BookingUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[];
  };

  export type FavoriteUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>
      | FavoriteCreateWithoutUserInput[]
      | FavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutUserInput
      | FavoriteCreateOrConnectWithoutUserInput[];
    upsert?:
      | FavoriteUpsertWithWhereUniqueWithoutUserInput
      | FavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FavoriteCreateManyUserInputEnvelope;
    set?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    disconnect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    delete?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    update?:
      | FavoriteUpdateWithWhereUniqueWithoutUserInput
      | FavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FavoriteUpdateManyWithWhereWithoutUserInput
      | FavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
  };

  export type OfferUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>
      | OfferCreateWithoutUserInput[]
      | OfferUncheckedCreateWithoutUserInput[];
    connectOrCreate?: OfferCreateOrConnectWithoutUserInput | OfferCreateOrConnectWithoutUserInput[];
    upsert?:
      | OfferUpsertWithWhereUniqueWithoutUserInput
      | OfferUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: OfferCreateManyUserInputEnvelope;
    set?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    disconnect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    delete?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    update?:
      | OfferUpdateWithWhereUniqueWithoutUserInput
      | OfferUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | OfferUpdateManyWithWhereWithoutUserInput
      | OfferUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: OfferScalarWhereInput | OfferScalarWhereInput[];
  };

  export type BookingUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
      | BookingCreateWithoutUserInput[]
      | BookingUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | BookingCreateOrConnectWithoutUserInput
      | BookingCreateOrConnectWithoutUserInput[];
    upsert?:
      | BookingUpsertWithWhereUniqueWithoutUserInput
      | BookingUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: BookingCreateManyUserInputEnvelope;
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[];
    update?:
      | BookingUpdateWithWhereUniqueWithoutUserInput
      | BookingUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | BookingUpdateManyWithWhereWithoutUserInput
      | BookingUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[];
  };

  export type FavoriteUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>
      | FavoriteCreateWithoutUserInput[]
      | FavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | FavoriteCreateOrConnectWithoutUserInput
      | FavoriteCreateOrConnectWithoutUserInput[];
    upsert?:
      | FavoriteUpsertWithWhereUniqueWithoutUserInput
      | FavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FavoriteCreateManyUserInputEnvelope;
    set?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    disconnect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    delete?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    connect?: FavoriteWhereUniqueInput | FavoriteWhereUniqueInput[];
    update?:
      | FavoriteUpdateWithWhereUniqueWithoutUserInput
      | FavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | FavoriteUpdateManyWithWhereWithoutUserInput
      | FavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
  };

  export type OfferUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>
      | OfferCreateWithoutUserInput[]
      | OfferUncheckedCreateWithoutUserInput[];
    connectOrCreate?: OfferCreateOrConnectWithoutUserInput | OfferCreateOrConnectWithoutUserInput[];
    upsert?:
      | OfferUpsertWithWhereUniqueWithoutUserInput
      | OfferUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: OfferCreateManyUserInputEnvelope;
    set?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    disconnect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    delete?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    connect?: OfferWhereUniqueInput | OfferWhereUniqueInput[];
    update?:
      | OfferUpdateWithWhereUniqueWithoutUserInput
      | OfferUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | OfferUpdateManyWithWhereWithoutUserInput
      | OfferUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: OfferScalarWhereInput | OfferScalarWhereInput[];
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
  };

  export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumOfferTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferType | EnumOfferTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferTypeFilter<$PrismaModel> | $Enums.OfferType;
  };

  export type NestedEnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
  };

  export type NestedEnumOfferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferStatus | EnumOfferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferStatusFilter<$PrismaModel> | $Enums.OfferStatus;
  };

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedEnumOfferTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferType | EnumOfferTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferType[] | ListEnumOfferTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferTypeWithAggregatesFilter<$PrismaModel> | $Enums.OfferType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumOfferTypeFilter<$PrismaModel>;
    _max?: NestedEnumOfferTypeFilter<$PrismaModel>;
  };

  export type NestedEnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumCurrencyFilter<$PrismaModel>;
    _max?: NestedEnumCurrencyFilter<$PrismaModel>;
  };

  export type NestedEnumOfferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OfferStatus | EnumOfferStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OfferStatus[] | ListEnumOfferStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOfferStatusWithAggregatesFilter<$PrismaModel> | $Enums.OfferStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumOfferStatusFilter<$PrismaModel>;
    _max?: NestedEnumOfferStatusFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type OfferCreateWithoutBookingsInput = {
    id?: string;
    type: $Enums.OfferType;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    favorites?: FavoriteCreateNestedManyWithoutOfferInput;
    destination: DestinationCreateNestedOneWithoutOffersInput;
    user: UserCreateNestedOneWithoutOffersInput;
  };

  export type OfferUncheckedCreateWithoutBookingsInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutOfferInput;
  };

  export type OfferCreateOrConnectWithoutBookingsInput = {
    where: OfferWhereUniqueInput;
    create: XOR<OfferCreateWithoutBookingsInput, OfferUncheckedCreateWithoutBookingsInput>;
  };

  export type UserCreateWithoutBookingsInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    favorites?: FavoriteCreateNestedManyWithoutUserInput;
    offers?: OfferCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutUserInput;
    offers?: OfferUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutBookingsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>;
  };

  export type OfferUpsertWithoutBookingsInput = {
    update: XOR<OfferUpdateWithoutBookingsInput, OfferUncheckedUpdateWithoutBookingsInput>;
    create: XOR<OfferCreateWithoutBookingsInput, OfferUncheckedCreateWithoutBookingsInput>;
    where?: OfferWhereInput;
  };

  export type OfferUpdateToOneWithWhereWithoutBookingsInput = {
    where?: OfferWhereInput;
    data: XOR<OfferUpdateWithoutBookingsInput, OfferUncheckedUpdateWithoutBookingsInput>;
  };

  export type OfferUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    favorites?: FavoriteUpdateManyWithoutOfferNestedInput;
    destination?: DestinationUpdateOneRequiredWithoutOffersNestedInput;
    user?: UserUpdateOneRequiredWithoutOffersNestedInput;
  };

  export type OfferUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    favorites?: FavoriteUncheckedUpdateManyWithoutOfferNestedInput;
  };

  export type UserUpsertWithoutBookingsInput = {
    update: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>;
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>;
  };

  export type UserUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    favorites?: FavoriteUpdateManyWithoutUserNestedInput;
    offers?: OfferUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    favorites?: FavoriteUncheckedUpdateManyWithoutUserNestedInput;
    offers?: OfferUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type OfferCreateWithoutDestinationInput = {
    id?: string;
    type: $Enums.OfferType;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteCreateNestedManyWithoutOfferInput;
    user: UserCreateNestedOneWithoutOffersInput;
  };

  export type OfferUncheckedCreateWithoutDestinationInput = {
    id?: string;
    type: $Enums.OfferType;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingUncheckedCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutOfferInput;
  };

  export type OfferCreateOrConnectWithoutDestinationInput = {
    where: OfferWhereUniqueInput;
    create: XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>;
  };

  export type OfferCreateManyDestinationInputEnvelope = {
    data: OfferCreateManyDestinationInput | OfferCreateManyDestinationInput[];
    skipDuplicates?: boolean;
  };

  export type OfferUpsertWithWhereUniqueWithoutDestinationInput = {
    where: OfferWhereUniqueInput;
    update: XOR<OfferUpdateWithoutDestinationInput, OfferUncheckedUpdateWithoutDestinationInput>;
    create: XOR<OfferCreateWithoutDestinationInput, OfferUncheckedCreateWithoutDestinationInput>;
  };

  export type OfferUpdateWithWhereUniqueWithoutDestinationInput = {
    where: OfferWhereUniqueInput;
    data: XOR<OfferUpdateWithoutDestinationInput, OfferUncheckedUpdateWithoutDestinationInput>;
  };

  export type OfferUpdateManyWithWhereWithoutDestinationInput = {
    where: OfferScalarWhereInput;
    data: XOR<OfferUpdateManyMutationInput, OfferUncheckedUpdateManyWithoutDestinationInput>;
  };

  export type OfferScalarWhereInput = {
    AND?: OfferScalarWhereInput | OfferScalarWhereInput[];
    OR?: OfferScalarWhereInput[];
    NOT?: OfferScalarWhereInput | OfferScalarWhereInput[];
    id?: StringFilter<"Offer"> | string;
    type?: EnumOfferTypeFilter<"Offer"> | $Enums.OfferType;
    destinationId?: StringFilter<"Offer"> | string;
    ownerId?: StringFilter<"Offer"> | string;
    title?: StringFilter<"Offer"> | string;
    description?: StringNullableFilter<"Offer"> | string | null;
    price?: DecimalFilter<"Offer"> | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFilter<"Offer"> | $Enums.Currency;
    maxGuests?: IntFilter<"Offer"> | number;
    maxConcurrentBookings?: IntFilter<"Offer"> | number;
    availableFrom?: DateTimeFilter<"Offer"> | Date | string;
    availableTo?: DateTimeFilter<"Offer"> | Date | string;
    status?: EnumOfferStatusFilter<"Offer"> | $Enums.OfferStatus;
    stars?: IntNullableFilter<"Offer"> | number | null;
    address?: StringNullableFilter<"Offer"> | string | null;
    flightNumber?: StringNullableFilter<"Offer"> | string | null;
    airline?: StringNullableFilter<"Offer"> | string | null;
    durationDays?: IntNullableFilter<"Offer"> | number | null;
    includesMeals?: BoolNullableFilter<"Offer"> | boolean | null;
    createdAt?: DateTimeFilter<"Offer"> | Date | string;
    updatedAt?: DateTimeFilter<"Offer"> | Date | string;
    deletedAt?: DateTimeNullableFilter<"Offer"> | Date | string | null;
  };

  export type OfferCreateWithoutFavoritesInput = {
    id?: string;
    type: $Enums.OfferType;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingCreateNestedManyWithoutOfferInput;
    destination: DestinationCreateNestedOneWithoutOffersInput;
    user: UserCreateNestedOneWithoutOffersInput;
  };

  export type OfferUncheckedCreateWithoutFavoritesInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingUncheckedCreateNestedManyWithoutOfferInput;
  };

  export type OfferCreateOrConnectWithoutFavoritesInput = {
    where: OfferWhereUniqueInput;
    create: XOR<OfferCreateWithoutFavoritesInput, OfferUncheckedCreateWithoutFavoritesInput>;
  };

  export type UserCreateWithoutFavoritesInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingCreateNestedManyWithoutUserInput;
    offers?: OfferCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutFavoritesInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput;
    offers?: OfferUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutFavoritesInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutFavoritesInput, UserUncheckedCreateWithoutFavoritesInput>;
  };

  export type OfferUpsertWithoutFavoritesInput = {
    update: XOR<OfferUpdateWithoutFavoritesInput, OfferUncheckedUpdateWithoutFavoritesInput>;
    create: XOR<OfferCreateWithoutFavoritesInput, OfferUncheckedCreateWithoutFavoritesInput>;
    where?: OfferWhereInput;
  };

  export type OfferUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: OfferWhereInput;
    data: XOR<OfferUpdateWithoutFavoritesInput, OfferUncheckedUpdateWithoutFavoritesInput>;
  };

  export type OfferUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUpdateManyWithoutOfferNestedInput;
    destination?: DestinationUpdateOneRequiredWithoutOffersNestedInput;
    user?: UserUpdateOneRequiredWithoutOffersNestedInput;
  };

  export type OfferUncheckedUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUncheckedUpdateManyWithoutOfferNestedInput;
  };

  export type UserUpsertWithoutFavoritesInput = {
    update: XOR<UserUpdateWithoutFavoritesInput, UserUncheckedUpdateWithoutFavoritesInput>;
    create: XOR<UserCreateWithoutFavoritesInput, UserUncheckedCreateWithoutFavoritesInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutFavoritesInput, UserUncheckedUpdateWithoutFavoritesInput>;
  };

  export type UserUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUpdateManyWithoutUserNestedInput;
    offers?: OfferUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput;
    offers?: OfferUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type BookingCreateWithoutOfferInput = {
    id?: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutBookingsInput;
  };

  export type BookingUncheckedCreateWithoutOfferInput = {
    id?: string;
    userId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BookingCreateOrConnectWithoutOfferInput = {
    where: BookingWhereUniqueInput;
    create: XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>;
  };

  export type BookingCreateManyOfferInputEnvelope = {
    data: BookingCreateManyOfferInput | BookingCreateManyOfferInput[];
    skipDuplicates?: boolean;
  };

  export type FavoriteCreateWithoutOfferInput = {
    id?: string;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutFavoritesInput;
  };

  export type FavoriteUncheckedCreateWithoutOfferInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
  };

  export type FavoriteCreateOrConnectWithoutOfferInput = {
    where: FavoriteWhereUniqueInput;
    create: XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>;
  };

  export type FavoriteCreateManyOfferInputEnvelope = {
    data: FavoriteCreateManyOfferInput | FavoriteCreateManyOfferInput[];
    skipDuplicates?: boolean;
  };

  export type DestinationCreateWithoutOffersInput = {
    id?: string;
    name: string;
    countryCode: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type DestinationUncheckedCreateWithoutOffersInput = {
    id?: string;
    name: string;
    countryCode: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type DestinationCreateOrConnectWithoutOffersInput = {
    where: DestinationWhereUniqueInput;
    create: XOR<DestinationCreateWithoutOffersInput, DestinationUncheckedCreateWithoutOffersInput>;
  };

  export type UserCreateWithoutOffersInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingCreateNestedManyWithoutUserInput;
    favorites?: FavoriteCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutOffersInput = {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutOffersInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutOffersInput, UserUncheckedCreateWithoutOffersInput>;
  };

  export type BookingUpsertWithWhereUniqueWithoutOfferInput = {
    where: BookingWhereUniqueInput;
    update: XOR<BookingUpdateWithoutOfferInput, BookingUncheckedUpdateWithoutOfferInput>;
    create: XOR<BookingCreateWithoutOfferInput, BookingUncheckedCreateWithoutOfferInput>;
  };

  export type BookingUpdateWithWhereUniqueWithoutOfferInput = {
    where: BookingWhereUniqueInput;
    data: XOR<BookingUpdateWithoutOfferInput, BookingUncheckedUpdateWithoutOfferInput>;
  };

  export type BookingUpdateManyWithWhereWithoutOfferInput = {
    where: BookingScalarWhereInput;
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutOfferInput>;
  };

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[];
    OR?: BookingScalarWhereInput[];
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[];
    id?: StringFilter<"Booking"> | string;
    userId?: StringFilter<"Booking"> | string;
    offerId?: StringFilter<"Booking"> | string;
    startDate?: DateTimeFilter<"Booking"> | Date | string;
    endDate?: DateTimeFilter<"Booking"> | Date | string;
    guestsCount?: IntFilter<"Booking"> | number;
    totalPrice?: DecimalFilter<"Booking"> | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
    createdAt?: DateTimeFilter<"Booking"> | Date | string;
    updatedAt?: DateTimeFilter<"Booking"> | Date | string;
  };

  export type FavoriteUpsertWithWhereUniqueWithoutOfferInput = {
    where: FavoriteWhereUniqueInput;
    update: XOR<FavoriteUpdateWithoutOfferInput, FavoriteUncheckedUpdateWithoutOfferInput>;
    create: XOR<FavoriteCreateWithoutOfferInput, FavoriteUncheckedCreateWithoutOfferInput>;
  };

  export type FavoriteUpdateWithWhereUniqueWithoutOfferInput = {
    where: FavoriteWhereUniqueInput;
    data: XOR<FavoriteUpdateWithoutOfferInput, FavoriteUncheckedUpdateWithoutOfferInput>;
  };

  export type FavoriteUpdateManyWithWhereWithoutOfferInput = {
    where: FavoriteScalarWhereInput;
    data: XOR<FavoriteUpdateManyMutationInput, FavoriteUncheckedUpdateManyWithoutOfferInput>;
  };

  export type FavoriteScalarWhereInput = {
    AND?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
    OR?: FavoriteScalarWhereInput[];
    NOT?: FavoriteScalarWhereInput | FavoriteScalarWhereInput[];
    id?: StringFilter<"Favorite"> | string;
    userId?: StringFilter<"Favorite"> | string;
    offerId?: StringFilter<"Favorite"> | string;
    createdAt?: DateTimeFilter<"Favorite"> | Date | string;
  };

  export type DestinationUpsertWithoutOffersInput = {
    update: XOR<DestinationUpdateWithoutOffersInput, DestinationUncheckedUpdateWithoutOffersInput>;
    create: XOR<DestinationCreateWithoutOffersInput, DestinationUncheckedCreateWithoutOffersInput>;
    where?: DestinationWhereInput;
  };

  export type DestinationUpdateToOneWithWhereWithoutOffersInput = {
    where?: DestinationWhereInput;
    data: XOR<DestinationUpdateWithoutOffersInput, DestinationUncheckedUpdateWithoutOffersInput>;
  };

  export type DestinationUpdateWithoutOffersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type DestinationUncheckedUpdateWithoutOffersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    countryCode?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUpsertWithoutOffersInput = {
    update: XOR<UserUpdateWithoutOffersInput, UserUncheckedUpdateWithoutOffersInput>;
    create: XOR<UserCreateWithoutOffersInput, UserUncheckedCreateWithoutOffersInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutOffersInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutOffersInput, UserUncheckedUpdateWithoutOffersInput>;
  };

  export type UserUpdateWithoutOffersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUpdateManyWithoutUserNestedInput;
    favorites?: FavoriteUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutOffersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput;
    favorites?: FavoriteUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type BookingCreateWithoutUserInput = {
    id?: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    offer: OfferCreateNestedOneWithoutBookingsInput;
  };

  export type BookingUncheckedCreateWithoutUserInput = {
    id?: string;
    offerId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type BookingCreateOrConnectWithoutUserInput = {
    where: BookingWhereUniqueInput;
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>;
  };

  export type BookingCreateManyUserInputEnvelope = {
    data: BookingCreateManyUserInput | BookingCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type FavoriteCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    offer: OfferCreateNestedOneWithoutFavoritesInput;
  };

  export type FavoriteUncheckedCreateWithoutUserInput = {
    id?: string;
    offerId: string;
    createdAt?: Date | string;
  };

  export type FavoriteCreateOrConnectWithoutUserInput = {
    where: FavoriteWhereUniqueInput;
    create: XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>;
  };

  export type FavoriteCreateManyUserInputEnvelope = {
    data: FavoriteCreateManyUserInput | FavoriteCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type OfferCreateWithoutUserInput = {
    id?: string;
    type: $Enums.OfferType;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteCreateNestedManyWithoutOfferInput;
    destination: DestinationCreateNestedOneWithoutOffersInput;
  };

  export type OfferUncheckedCreateWithoutUserInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    bookings?: BookingUncheckedCreateNestedManyWithoutOfferInput;
    favorites?: FavoriteUncheckedCreateNestedManyWithoutOfferInput;
  };

  export type OfferCreateOrConnectWithoutUserInput = {
    where: OfferWhereUniqueInput;
    create: XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>;
  };

  export type OfferCreateManyUserInputEnvelope = {
    data: OfferCreateManyUserInput | OfferCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type BookingUpsertWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput;
    update: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>;
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>;
  };

  export type BookingUpdateWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput;
    data: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>;
  };

  export type BookingUpdateManyWithWhereWithoutUserInput = {
    where: BookingScalarWhereInput;
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutUserInput>;
  };

  export type FavoriteUpsertWithWhereUniqueWithoutUserInput = {
    where: FavoriteWhereUniqueInput;
    update: XOR<FavoriteUpdateWithoutUserInput, FavoriteUncheckedUpdateWithoutUserInput>;
    create: XOR<FavoriteCreateWithoutUserInput, FavoriteUncheckedCreateWithoutUserInput>;
  };

  export type FavoriteUpdateWithWhereUniqueWithoutUserInput = {
    where: FavoriteWhereUniqueInput;
    data: XOR<FavoriteUpdateWithoutUserInput, FavoriteUncheckedUpdateWithoutUserInput>;
  };

  export type FavoriteUpdateManyWithWhereWithoutUserInput = {
    where: FavoriteScalarWhereInput;
    data: XOR<FavoriteUpdateManyMutationInput, FavoriteUncheckedUpdateManyWithoutUserInput>;
  };

  export type OfferUpsertWithWhereUniqueWithoutUserInput = {
    where: OfferWhereUniqueInput;
    update: XOR<OfferUpdateWithoutUserInput, OfferUncheckedUpdateWithoutUserInput>;
    create: XOR<OfferCreateWithoutUserInput, OfferUncheckedCreateWithoutUserInput>;
  };

  export type OfferUpdateWithWhereUniqueWithoutUserInput = {
    where: OfferWhereUniqueInput;
    data: XOR<OfferUpdateWithoutUserInput, OfferUncheckedUpdateWithoutUserInput>;
  };

  export type OfferUpdateManyWithWhereWithoutUserInput = {
    where: OfferScalarWhereInput;
    data: XOR<OfferUpdateManyMutationInput, OfferUncheckedUpdateManyWithoutUserInput>;
  };

  export type OfferCreateManyDestinationInput = {
    id?: string;
    type: $Enums.OfferType;
    ownerId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type OfferUpdateWithoutDestinationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUpdateManyWithoutOfferNestedInput;
    user?: UserUpdateOneRequiredWithoutOffersNestedInput;
  };

  export type OfferUncheckedUpdateWithoutDestinationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUncheckedUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUncheckedUpdateManyWithoutOfferNestedInput;
  };

  export type OfferUncheckedUpdateManyWithoutDestinationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    ownerId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
  };

  export type BookingCreateManyOfferInput = {
    id?: string;
    userId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FavoriteCreateManyOfferInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
  };

  export type BookingUpdateWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput;
  };

  export type BookingUncheckedUpdateWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BookingUncheckedUpdateManyWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteUpdateWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutFavoritesNestedInput;
  };

  export type FavoriteUncheckedUpdateWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteUncheckedUpdateManyWithoutOfferInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BookingCreateManyUserInput = {
    id?: string;
    offerId: string;
    startDate: Date | string;
    endDate: Date | string;
    guestsCount: number;
    totalPrice: Decimal | DecimalJsLike | number | string;
    status?: $Enums.BookingStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type FavoriteCreateManyUserInput = {
    id?: string;
    offerId: string;
    createdAt?: Date | string;
  };

  export type OfferCreateManyUserInput = {
    id?: string;
    type: $Enums.OfferType;
    destinationId: string;
    title: string;
    description?: string | null;
    price: Decimal | DecimalJsLike | number | string;
    currency: $Enums.Currency;
    maxGuests?: number;
    maxConcurrentBookings?: number;
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: $Enums.OfferStatus;
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type BookingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offer?: OfferUpdateOneRequiredWithoutBookingsNestedInput;
  };

  export type BookingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type BookingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    guestsCount?: IntFieldUpdateOperationsInput | number;
    totalPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    offer?: OfferUpdateOneRequiredWithoutFavoritesNestedInput;
  };

  export type FavoriteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type FavoriteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    offerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OfferUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUpdateManyWithoutOfferNestedInput;
    destination?: DestinationUpdateOneRequiredWithoutOffersNestedInput;
  };

  export type OfferUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    bookings?: BookingUncheckedUpdateManyWithoutOfferNestedInput;
    favorites?: FavoriteUncheckedUpdateManyWithoutOfferNestedInput;
  };

  export type OfferUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumOfferTypeFieldUpdateOperationsInput | $Enums.OfferType;
    destinationId?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    currency?: EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    maxGuests?: IntFieldUpdateOperationsInput | number;
    maxConcurrentBookings?: IntFieldUpdateOperationsInput | number;
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    availableTo?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumOfferStatusFieldUpdateOperationsInput | $Enums.OfferStatus;
    stars?: NullableIntFieldUpdateOperationsInput | number | null;
    address?: NullableStringFieldUpdateOperationsInput | string | null;
    flightNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    airline?: NullableStringFieldUpdateOperationsInput | string | null;
    durationDays?: NullableIntFieldUpdateOperationsInput | number | null;
    includesMeals?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
