import { environment } from "../../environments/environment";

export class assetHelper {

    static instance: assetHelper;

    private route: string = environment.modelUrl;
    private nameMap: Map<string, string> = new Map<string, string>;

    private constructor() {
        // ----- Bases -----
        this.nameMap.set("cube",                            "bases/cube"                       );
        this.nameMap.set("D-shape.gltf",                    "bases/D-shape"                    );
        this.nameMap.set("bent-shape.gltf",                 "bases/bent-shape"                 );
        this.nameMap.set("open-shape.gltf",                 "bases/open-shape"                 );
        this.nameMap.set("round-shape.gltf",                "bases/round-shape"                );
        this.nameMap.set("flat-shape.gltf",                 "bases/flat-shape"                 );
        this.nameMap.set("D-shape-incrustado.gltf",         "bases/D-shape-incrustado"         );
        this.nameMap.set("double-ring-round-version.gltf",  "bases/double-ring-round-version"  );
        
        // ----- Engastes -----
        this.nameMap.set("bezel_oval_H_1q.gltf",        "engastes/bezel_oval_H_1q"      );
        this.nameMap.set("bezel_oval_V_1q.gltf",        "engastes/bezel_oval_V_1q"      );
        this.nameMap.set("bezel_round_1q.gltf",         "engastes/bezel_round_1q"       );
        this.nameMap.set("engaste_crown_round.gltf",    "engastes/engaste_crown_round"  );
        this.nameMap.set("prong_oval_H_1q.gltf",        "engastes/prong_oval_H_1q"      );
        this.nameMap.set("prong_oval_V_1q.gltf",        "engastes/prong_oval_V_1q"      );
        this.nameMap.set("prong_round_X_1q.gltf",       "engastes/prong_round_X_1q"     );
        this.nameMap.set("prong_round.gltf",            "engastes/prong_round"          );
        this.nameMap.set("double_prong_round_X.gltf",   "engastes/double_prong_round_X" );
        this.nameMap.set("double_prong_round.gltf",     "engastes/double_prong_round"   );
        this.nameMap.set("prong_princess.gltf",         "engastes/prong_princess"       );
        this.nameMap.set("eng_princess_v2.gltf",        "engastes/eng_princess_v2"      );
        this.nameMap.set("double_prong_princess.gltf",  "engastes/double_prong_princess");
        this.nameMap.set("prong_emerald.gltf",          "engastes/prong_emerald"        );
        this.nameMap.set("double_prong_emerald.gltf",   "engastes/double_prong_emerald" );
        this.nameMap.set("prong_marq_6.gltf",           "engastes/prong_marq_6"         );
        this.nameMap.set("double_prong_oval.gltf",      "engastes/double_prong_oval"    );
        this.nameMap.set("double_prong_oval_ew.gltf",   "engastes/double_prong_oval_ew" );
        this.nameMap.set("prong_marq_4.gltf",           "engastes/prong_marq_4"         );
        this.nameMap.set("double_prong_marq.gltf",      "engastes/double_prong_marq"    );
        this.nameMap.set("prong_pera.gltf",             "engastes/prong_pera"           );
        this.nameMap.set("double_prong_pear.gltf",      "engastes/double_prong_pear"    );
        this.nameMap.set("bezel_marq.gltf",             "engastes/bezel_marq"           );
        this.nameMap.set("bezel_pera.gltf",             "engastes/bezel_pera"           );
        this.nameMap.set("bezel_emerald.gltf",          "engastes/bezel_emerald"        );
        this.nameMap.set("bezel_princess.gltf",         "engastes/bezel_princess"       );
        this.nameMap.set("none5.gltf",                  "engastes/none5"                );
        this.nameMap.set("double_prong_oval_ew.gltf",   "engastes/double_prong_oval_ew" );

        
        // ----- Gemas -----
        this.nameMap.set("gem_oval_H_1q.gltf", "gemas/gem_oval_H_1q" );
        this.nameMap.set("gem_oval_V_1q.gltf", "gemas/gem_oval_V_1q" );
        this.nameMap.set("gem_round_1q.gltf",  "gemas/gem_round_1q"  );
        this.nameMap.set("gem_princess.gltf",  "gemas/gem_princess"  );
        this.nameMap.set("gem_marq.gltf",      "gemas/gem_marq"      );
        this.nameMap.set("gem_pera.gltf",      "gemas/gem_pera"      );
        this.nameMap.set("gem_esme.gltf",      "gemas/gem_esme"      );

        // ---- Cajas -----
        this.nameMap.set("caja_cuadrada", "cajas/caja_cuadrada");
        this.nameMap.set("caja_circular", "cajas/caja_circular");
        this.nameMap.set("caja_corazon",   "cajas/caja_corazon");
    }

    static getInstance(): assetHelper {
        if (!this.instance) this.instance = new assetHelper();

        return this.instance;
    }

    static getRouteByName(name: string, engine: "three" | "webgl" = "three"): string | undefined {

        const assetRoute: string | undefined = this.getInstance().nameMap.get(name);

        if (!assetRoute) return undefined;

        let fileType: string = "";

        switch (engine) {
            case "three":
                fileType = "gltf"     
                break;

            case "webgl":
                fileType = "json"     
                break;
        
            default:
                fileType = "gltf"  
                break;
        }

        return `${this.getInstance().route}/${assetRoute}.${fileType}`
    }

    
}