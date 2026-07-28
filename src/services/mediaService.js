import {
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";
import { getMediaType } from "../config/mediaTypes.js";

const validStatuses = new Set(["watchlist", "watched"]);

export class MediaService {
  constructor(mediaType, prismaClient) {
    this.config = getMediaType(mediaType);
    this.prisma = prismaClient;
  }

  async add(userId, mediaData) {
    const {
      mediaModel,
      userMediaModel,
      foreignKeyField,
      externalIdField,
      displayNameField,
      compositeKey,
      relationField,
      includeOnWrite,
    } = this.config.prisma;
    const externalId = Number(mediaData[externalIdField]);
    const displayName = mediaData[displayNameField];
    const { posterPath, status, isFavorite } = mediaData;

    const {
      requiredFields,
      requiredMessage,
      validateStatus,
    } = this.config.validation;

    if (requiredFields.some((field) => !mediaData[field])) {
      throw new ValidationError(requiredMessage);
    }

    if (validateStatus) {
      this.validateStatus(status);
    }

    let media = await this.prisma[mediaModel].findUnique({
      where: { [externalIdField]: externalId },
    });

    if (!media) {
      media = await this.prisma[mediaModel].create({
        data: {
          [externalIdField]: externalId,
          [displayNameField]: displayName,
          posterPath,
        },
      });
    }

    return this.prisma[userMediaModel].upsert({
      where: {
        [compositeKey]: {
          userId,
          [foreignKeyField]: media.id,
        },
      },
      update: {
        status,
        isFavorite: isFavorite ?? false,
      },
      create: {
        userId,
        [foreignKeyField]: media.id,
        status,
        isFavorite: isFavorite ?? false,
      },
      ...(includeOnWrite && {
        include: {
          [relationField]: true,
        },
      }),
    });
  }

  getAll(userId) {
    const { userMediaModel, relationField } = this.config.prisma;

    return this.prisma[userMediaModel].findMany({
      where: { userId },
      include: {
        [relationField]: true,
      },
    });
  }

  async update(userId, id, updates) {
    const {
      userMediaModel,
      relationField,
      includeOnWrite,
    } = this.config.prisma;
    const userMediaId = Number(id);
    const existingMedia = await this.prisma[userMediaModel].findFirst({
      where: {
        id: userMediaId,
        userId,
      },
    });

    if (!existingMedia) {
      throw new NotFoundError(this.config.notFoundMessage);
    }

    const { status, isFavorite } = updates;

    if (
      status !== undefined &&
      this.config.validation.validateStatus
    ) {
      this.validateStatus(status);
    }

    return this.prisma[userMediaModel].update({
      where: { id: userMediaId },
      data: {
        ...(status !== undefined && { status }),
        ...(isFavorite !== undefined && { isFavorite }),
      },
      ...(includeOnWrite && {
        include: {
          [relationField]: true,
        },
      }),
    });
  }

  async delete(userId, id) {
    const { userMediaModel } = this.config.prisma;
    const userMedia = await this.prisma[userMediaModel].findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!userMedia) {
      throw new NotFoundError(this.config.notFoundMessage);
    }

    await this.prisma[userMediaModel].delete({
      where: { id: userMedia.id },
    });

    return {
      message: `${this.config.label} deleted successfully`,
    };
  }

  check(userId, mediaId) {
    const { userMediaModel, foreignKeyField } = this.config.prisma;

    return this.prisma[userMediaModel].findFirst({
      where: {
        userId,
        [foreignKeyField]: Number(mediaId),
      },
    });
  }

  async getStatus(userId, externalMediaId) {
    const {
      userMediaModel,
      relationField,
      externalIdField,
    } = this.config.prisma;
    const userMedia = await this.prisma[userMediaModel].findFirst({
      where: {
        userId,
        [relationField]: {
          [externalIdField]: Number(externalMediaId),
        },
      },
    });

    if (!userMedia) {
      return null;
    }

    return {
      id: userMedia.id,
      status: userMedia.status,
      isFavorite: userMedia.isFavorite,
    };
  }

  validateStatus(status) {
    if (!validStatuses.has(status)) {
      throw new ValidationError(`Invalid ${this.config.label} status`);
    }
  }
}
