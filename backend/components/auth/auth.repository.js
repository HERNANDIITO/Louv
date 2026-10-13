import RefreshToken from '../../db-schemas/refresh-token.schema.js';

const subjectFilter = (subjectId) => ({
    $or: [{ user: subjectId }, { employee: subjectId }],
});

export const findValidToken = async (userAgent) => {
    // Buscamos solo los tokens que:
    // - Coincidan con el UserAgent (optimización)
    // - No hayan expirado todavía
    return await RefreshToken.find({
        userAgent,
        expiresAt: { $gt: new Date() }
    }).lean();

};

export const findBySubject = (subjectId) => {
    return RefreshToken.find(subjectFilter(subjectId)).lean();
};

export const upsert = (data) => {
    const filter = data.user
        ? { user: data.user, userAgent: data.userAgent }
        : { employee: data.employee, userAgent: data.userAgent };

    return RefreshToken.findOneAndUpdate(filter, data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    });
};

export const deleteBySubject = (subjectId) => {
    return RefreshToken.deleteMany(subjectFilter(subjectId));
};

export const deleteById = (id) => {
    return RefreshToken.findByIdAndDelete(id);
};

export const deleteOldestBySubject = (subjectId) => {
    return RefreshToken.findOneAndDelete(subjectFilter(subjectId), { sort: { createdAt: 1 } });
};

export const enforceLimit = async (subjectId, maxSessions) => {
    const filter = subjectFilter(subjectId);
    const count = await RefreshToken.countDocuments(filter);

    if (count >= maxSessions) {
        await RefreshToken.findOneAndDelete(filter, {
            sort: { createdAt: 1 },
        });
    }
};
