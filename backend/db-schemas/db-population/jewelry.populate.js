import mongoose from "mongoose";
import Jewelry from "../jewelry.schema.js";
import BaseStructure from "../base-structure.schema.js";
import Size from "../size.schema.js";
import Material from "../material.schema.js";
import Profile from "../profile.schema.js";
import Setting from "../setting.schema.js";
import Gemstone from "../gemstone.schema.js";
import Cut from "../cut.schema.js";
import Box from "../box.schema.js";
import BoxInnerMaterial from "../box-inner-material.schema.js";
import BoxOuterMaterial from "../box-outer-material.schema.js";
import BoxDetailMaterial from "../box-detail-material.schema.js";
import User from "../user.schema.js";
import crypto from 'crypto';

async function populateJewelryCollection(deps = {}) {
	try {

		/* ----------------------------- CARGA DE DATOS ----------------------------- */

        const users = deps.User && deps.User.length ? deps.User : await User.find().lean();

        const baseStructures = deps.BaseStructure && deps.BaseStructure.length ? deps.BaseStructure : await BaseStructure.find();
        const baseStructureByName = {};
        for (const bs of baseStructures) baseStructureByName[bs.name] = bs._id;

        const sizes = deps.Size && deps.Size.length ? deps.Size : await Size.find();
        const sizeByName = {};
        for (const s of sizes) sizeByName[s.name] = s._id;

        const profiles = deps.Profile && deps.Profile.length ? deps.Profile : await Profile.find();
        const profileByName = {};
        for (const p of profiles) profileByName[p.name] = p._id;
    
        const materials = deps.Material && deps.Material.length ? deps.Material : await Material.find();
        const matByName = {};
        for (const m of materials) matByName[m.name] = m._id;
    
        const cuts = deps.Cut && deps.Cut.length ? deps.Cut : await Cut.find();
        const cutByName = {};
        for (const c of cuts) cutByName[c.name] = c._id;
    
        const settings = deps.Setting && deps.Setting.length ? deps.Setting.map(s => s.toObject()) : await Setting.find().lean();
        const settingByName = {};
        for (const s of settings) settingByName[s.name] = s._id;
    
        const gems = deps.Gemstone && deps.Gemstone.length ? deps.Gemstone : await Gemstone.find();
        const gemByName = {};
        for (const g of gems) gemByName[g.name] = g._id;

        const boxes = deps.Box && deps.Box.length ? deps.Box : await Box.find();
        const boxByName = {};
        for (const b of boxes) boxByName[b.name] = b._id;

        const boxesInner = deps.BoxInnerMaterial && deps.BoxInnerMaterial.length ? deps.BoxInnerMaterial : await BoxInnerMaterial.find();
        const boxInnerByName = {};
        for (const b of boxesInner) boxInnerByName[b.name] = b._id;

        const boxesOuter = deps.BoxOuterMaterial && deps.BoxOuterMaterial.length ? deps.BoxOuterMaterial : await BoxOuterMaterial.find();
        const boxOuterByName = {};
        for (const b of boxesOuter) boxOuterByName[b.name] = b._id;

        const boxesDetail = deps.BoxDetailMaterial && deps.BoxDetailMaterial.length ? deps.BoxDetailMaterial : await BoxDetailMaterial.find();
        const boxDetailByName = {};
        for (const b of boxesDetail) boxDetailByName[b.name] = b._id;

         /* ------------------------- FUNCIONES PICK + LOGS -------------------------- */

        const pickUser = (name) => {
            const id = users.find((user)=> user.name === name)._id;
            return id;
        };

        const pickBaseStructure = (name) => {
            const id = baseStructureByName[name] || Object.values(baseStructureByName)[0] || null;
            return id;
        };

        const pickSize = (name) => {
            const id = sizeByName[name] || Object.values(sizeByName)[0] || null;
            return id;
        };

        const pickProfile = (name) => {
            const id = profileByName[name] || Object.values(profileByName)[0] || null;
            return id;
        };

        const pickMat = (name) => {
            const id = matByName[name] || Object.values(matByName)[0] || null;
            return id;
        };

        const pickCut = (name) => {
            const id = cutByName[name] || null;
            return id;
        };

        const pickSetting = (name) => {
            const id = settingByName[name] || null;
            return id;
        };

        const pickGem = (name) => {
            const id = gemByName[name] || null;
            return id;
        };

        const pickBox = (name) => {
            const id = boxByName[name] || null;
            return id;
        };

        const pickBoxInner = (name) => {
            const id = boxInnerByName[name] || null;
            return id;
        };
        const pickBoxOuter = (name) => {
            const id = boxOuterByName[name] || null;
            return id;
        };
        const pickBoxDetail = (name) => {
            const id = boxDetailByName[name] || null;
            return id;
        };
        
        /* ------------------------- FUNCIONES GET ------------------------- */

        const getClawNumberId = (settingName, clawNumberName) => {
            const setting  = settings.find(x => x.name === settingName);
            
            if (!setting ) { 
                return null; 
            }
            
            const clawNumber = setting.clawNumber?.find(
                cn => cn.name === clawNumberName
            );
            if (!clawNumber) return null;

            return clawNumber._id;
        };

        const getClawTypeId = (settingName, clawNumberName, clawTypeName) => {
            const setting = settings.find(s => s.name === settingName);
            if (!setting) return null;

            const clawNumber = setting.clawNumber?.find(
                cn => cn.name === clawNumberName
            );
            if (!clawNumber) return null;

            // compatibleCuts es un array
            for (const cut of clawNumber.compatibleCuts ?? []) {
                const clawType = cut.clawType?.find(
                ct => ct.name.toLowerCase() === clawTypeName.toLowerCase()
                );
                if (clawType) return clawType._id;
            }

            return null;
        };

        const getMaterialPurity = (materialName) => {
            const mat = materials.find(m => m.name === materialName);

            if (!mat) {
                return null; 
            }

            return mat.purities[0]?._id || null;
        }

        const getProfileAndVariant = (baseStructureName, profileName, variantName) => {
          // 1. Encontrar el documento COMPLETO de la BaseStructure
          const bsDoc = baseStructures.find(bs => bs.name === baseStructureName);
          if (!bsDoc) {
              return null;
          }

          // 2. Encontrar el ID global del Profile por su nombre
          const globalProfileDoc = profiles.find(p => p.name === profileName);
          if (!globalProfileDoc) {
              return null;
          }

          const globalProfileId = globalProfileDoc._id;

          // 3. Buscar el profile dentro de la BaseStructure
          const profileEntry = bsDoc.profiles?.find(p => 
              p.profile.equals(globalProfileId)
          );

          if (!profileEntry) {
              return null;
          }

          const profileId = profileEntry.profile;

          // 4. Buscar la variante por nombre
          const variantEntry = profileEntry.variants?.find(v => 
              v.name === variantName
          );

          if (!variantEntry) {
              return {
                  profileId,
                  variantId: null
              };
          }

          return {
              profileId,
              variantId: variantEntry._id
          };
      };
        const generateShareHash = (length = 10) => {
            // Usamos un alfabeto que evita caracteres confusos (0, O, I, l)
            const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
            let hash = '';
            const bytes = crypto.randomBytes(length);
            for (let i = 0; i < length; i++) {
                hash += alphabet[bytes[i] % alphabet.length];
            }
            return hash;
        };

		const jewelries = [
			{
				name: "Solitario Diamante",
				user: pickUser("Juan"),
                creationDate: new Date().toISOString(),
                lastEdition: new Date().toISOString(),
                timesEdited: 5,
                timeSpent: 120,
				taxablePrice: mongoose.Types.Decimal128.fromString("1500.00"),
				currentPrice: mongoose.Types.Decimal128.fromString("1500.00"),
				taxableHistory: [mongoose.Types.Decimal128.fromString("1500.00")],
				priceHistory: [mongoose.Types.Decimal128.fromString("1500.00")],
                shareHashWithPrice: generateShareHash(10),
                shareHashWithoutPrice: generateShareHash(10),
                timesHashRenewed: 0,
                hasBeenInCart: false,
                snapshot: "solitario_diamante.png",
				composition: {
					baseStructure: pickBaseStructure("Clásico"),
					size: pickSize("10"),
					material: pickMat("Platino"),
					materialPurity: getMaterialPurity("Platino"),
					profile: getProfileAndVariant("Clásico", "Media caña", "1 gema") ? getProfileAndVariant("Clásico", "Media caña", "1 gema").profileId : null,
          variant: getProfileAndVariant("Clásico", "Media caña", "1 gema") ? getProfileAndVariant("Clásico", "Media caña", "1 gema").variantId : null,
					settingsSize: "one-size",
					settings: [
						{
							setting: pickSetting("Prong diagonal"),
							gemstone: pickGem("Diamante"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong diagonal", "4 garras"),
							clawType: getClawTypeId("Prong diagonal", "4 garras","Simple"),
							pattern: []
						}
					]
				},
				box: pickBox("Caja Corazón"),
				boxInnerColor: pickBoxInner("Terciopelo blanco"),
				boxOuterColor: pickBoxOuter("Cuero roja"),
				boxDetailColor: pickBoxDetail("Latón macizo")
			},
      {
				name: "Halo brillante",
				user: pickUser("Ana"),
                creationDate: new Date().toISOString(),
                lastEdition: new Date().toISOString(),
                timesEdited: 0,
                timeSpent: 10,
				taxablePrice: mongoose.Types.Decimal128.fromString("0.00"),
				currentPrice: mongoose.Types.Decimal128.fromString("0.00"),
				taxableHistory: [mongoose.Types.Decimal128.fromString("0.00")],
				priceHistory: [mongoose.Types.Decimal128.fromString("0.00")],
                shareHashWithPrice: generateShareHash(10),
                shareHashWithoutPrice: generateShareHash(10),
                timesHashRenewed: 0,
                hasBeenInCart: false,
                snapshot: "halo.png",
				composition: {
					baseStructure: pickBaseStructure("Clásico"),
					size: pickSize("10"),
					material: pickMat("Oro amarillo"),
					materialPurity: getMaterialPurity("Oro amarillo"),
					profile: getProfileAndVariant("Clásico", "Redondo", "1 gema") ? getProfileAndVariant("Clásico", "Redondo", "1 gema").profileId : null,
          variant: getProfileAndVariant("Clásico", "Redondo", "1 gema") ? getProfileAndVariant("Clásico", "Redondo", "1 gema").variantId : null,
					settingsSize: "one-size",
					settings: [
						{
							setting: pickSetting("Halo"),
							gemstone: pickGem("Aguamarina"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Halo", "4 garras"),
							clawType: getClawTypeId("Halo", "4 garras","Simple"),
							pattern: []
						}
					]
				},
				box: pickBox("Caja Cuadrada"),
				boxInnerColor: pickBoxInner("Terciopelo rojo"),
				boxOuterColor: pickBoxOuter("Madera lacada negra"),
				boxDetailColor: pickBoxDetail("Oro 24K")
			},
      {
				name: "Trinity",
				user: pickUser("Juan"),
                creationDate: new Date().toISOString(),
                lastEdition: new Date().toISOString(),
                timesEdited: 0,
                timeSpent: 10,
				taxablePrice: mongoose.Types.Decimal128.fromString("0.00"),
				currentPrice: mongoose.Types.Decimal128.fromString("0.00"),
				taxableHistory: [mongoose.Types.Decimal128.fromString("0.00")],
				priceHistory: [mongoose.Types.Decimal128.fromString("0.00")],
                shareHashWithPrice: generateShareHash(10),
                shareHashWithoutPrice: generateShareHash(10),
                timesHashRenewed: 0,
                hasBeenInCart: false,
                snapshot: "trinity.png",
				composition: {
					baseStructure: pickBaseStructure("Clásico"),
					size: pickSize("10"),
					material: pickMat("Platino"),
					materialPurity: getMaterialPurity("Platino"),
					profile: getProfileAndVariant("Clásico", "Redondo", "3 gemas") ? getProfileAndVariant("Clásico", "Redondo", "3 gemas").profileId : null,
          variant: getProfileAndVariant("Clásico", "Redondo", "3 gemas") ? getProfileAndVariant("Clásico", "Redondo", "3 gemas").variantId : null,
					settingsSize: "one-size",
					settings: [
						{
							setting: pickSetting("Prong"),
							gemstone: pickGem("Rubí"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Aguamarina"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Rubí"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						}
					]
				},
				box: pickBox("Caja Cuadrada"),
				boxInnerColor: pickBoxInner("Terciopelo rojo"),
				boxOuterColor: pickBoxOuter("Madera lacada negra"),
				boxDetailColor: pickBoxDetail("Oro 24K")
			},
      {
				name: "Mi creación",
				user: pickUser("Carlos"),
        creationDate: new Date().toISOString(),
        lastEdition: new Date().toISOString(),
        timesEdited: 0,
        timeSpent: 10,
				taxablePrice: mongoose.Types.Decimal128.fromString("0.00"),
				currentPrice: mongoose.Types.Decimal128.fromString("0.00"),
				taxableHistory: [mongoose.Types.Decimal128.fromString("0.00")],
				priceHistory: [mongoose.Types.Decimal128.fromString("0.00")],
        shareHashWithPrice: generateShareHash(10),
        shareHashWithoutPrice: generateShareHash(10),
        timesHashRenewed: 0,
        hasBeenInCart: false,
        snapshot: "mi_creacion_carlos.png",
				composition: {
					baseStructure: pickBaseStructure("Clásico"),
					size: pickSize("10"),
					material: pickMat("Oro rosa"),
					materialPurity: getMaterialPurity("Oro rosa"),
					profile: getProfileAndVariant("Clásico", "Liso", "3 gemas") ? getProfileAndVariant("Clásico", "Liso", "3 gemas").profileId : null,
          variant: getProfileAndVariant("Clásico", "Liso", "3 gemas") ? getProfileAndVariant("Clásico", "Liso", "3 gemas").variantId : null,
					settingsSize: "one-size",
					settings: [
						{
							setting: pickSetting("Prong"),
							gemstone: pickGem("Diamante"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Amatista"),
							gemstoneCut: pickCut("Princesa"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Doble"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Diamante"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						}
					]
				},
				box: pickBox("Caja Cuadrada"),
				boxInnerColor: pickBoxInner("Terciopelo rojo"),
				boxOuterColor: pickBoxOuter("Madera lacada negra"),
				boxDetailColor: pickBoxDetail("Oro 24K")
			},
      {
				name: "Mi creación",
				user: pickUser("UserTest"),
        creationDate: new Date().toISOString(),
        lastEdition: new Date().toISOString(),
        timesEdited: 0,
        timeSpent: 10,
				taxablePrice: mongoose.Types.Decimal128.fromString("0.00"),
				currentPrice: mongoose.Types.Decimal128.fromString("0.00"),
				taxableHistory: [mongoose.Types.Decimal128.fromString("0.00")],
				priceHistory: [mongoose.Types.Decimal128.fromString("0.00")],
        shareHashWithPrice: generateShareHash(10),
        shareHashWithoutPrice: generateShareHash(10),
        timesHashRenewed: 0,
        hasBeenInCart: false,
        snapshot: "mi_creacion_usertest.png",
				composition: {
					baseStructure: pickBaseStructure("Clásico"),
					size: pickSize("10"),
					material: pickMat("Oro rosa"),
					materialPurity: getMaterialPurity("Oro rosa"),
					profile: getProfileAndVariant("Clásico", "Liso", "3 gemas") ? getProfileAndVariant("Clásico", "Liso", "3 gemas").profileId : null,
          variant: getProfileAndVariant("Clásico", "Liso", "3 gemas") ? getProfileAndVariant("Clásico", "Liso", "3 gemas").variantId : null,
					settingsSize: "one-size",
					settings: [
						{
							setting: pickSetting("Prong"),
							gemstone: pickGem("Diamante"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Amatista"),
							gemstoneCut: pickCut("Princesa"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Doble"),
							pattern: []
						},
            {
							setting: pickSetting("Prong"),
							gemstone: pickGem("Diamante"),
							gemstoneCut: pickCut("Brillante"),
							isSynthetic: false,
							clawNumber: getClawNumberId("Prong", "4 garras"),
							clawType: getClawTypeId("Prong", "4 garras","Simple"),
							pattern: []
						}
					]
				},
				box: pickBox("Caja Cuadrada"),
				boxInnerColor: pickBoxInner("Terciopelo rojo"),
				boxOuterColor: pickBoxOuter("Madera lacada negra"),
				boxDetailColor: pickBoxDetail("Oro 24K")
			}
		];

		const created = [];

		for (const j of jewelries) {
			// evitar duplicados por name + user si existe
			const query = { name: j.name };
			if (j.user) query.user = j.user;

			const existing = await Jewelry.findOne(query);
			if (existing) {
				continue;
			}

			const doc = new Jewelry(j);
			await doc.save();
			created.push({ _id: doc._id, name: doc.name });
		}

		return { Jewelry: created };
	} catch (error) {
		console.error("Error al poblar Jewelry:", error);
	}
}

export default populateJewelryCollection;

