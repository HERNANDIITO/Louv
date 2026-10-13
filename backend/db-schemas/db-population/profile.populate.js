import Profile from "../profile.schema.js";

async function populateProfileCollection(deps = {}) {
  try {

    const profiles = [
      { name: "Media caña", image: "mediacanya.svg" },
      { name: "Redondo", image: "redondo.svg" },
      { name: "Liso", image: "plano.svg" },
    ];

    const created = [];
    for (const p of profiles) {
        // Evitar duplicados por nombre
        const existing = await Profile.findOne({ name: p.name });

        if (existing) {
            continue; // saltar al siguiente
        }

        // Crear el perfil nuevo
        const profile = new Profile(p);
        await profile.save();

        created.push({ _id: profile._id, name: profile.name });
    }

    return { Profile: created };
  } catch (error) {
  }
}

export default populateProfileCollection;
