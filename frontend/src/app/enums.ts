// src/app/constants/enums.ts

const ENUMS = {
    JEWELRY_TYPES: ["ring"] as const,
    SPAIN_PROVINCES: [
        "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
        "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria",
        "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca", "Gerona",
        "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca",
        "Islas Baleares", "Jaén", "La Coruña", "La Rioja", "Las Palmas",
        "León", "Lérida", "Lugo", "Madrid", "Málaga", "Melilla", "Murcia",
        "Navarra", "Orense", "Palencia", "Pontevedra", "Salamanca",
        "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona",
        "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
    ] as const,
    COUNTRIES: ["spain"] as const,
    ROLES: ["admin"] as const,
    COMPONENT_TYPES: ["BaseStructure", "Material", "Gemstone", "Pattern"] as const,
    ZODIAC_SIGNS: [
        "aries", "taurus", "gemini", "cancer", "leo", "virgo",
        "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
    ] as const,
    MATERIALS: ["gold", "platinum"] as const,
    PURITIES: ["10K", "14K", "18K"] as const,
    ALLERGENS: ["nickel", "cobalt", "chromium"] as const, // TODO: completar según uso
    MEASUREMENT_SYSTEMS: ["ES-IT"] as const,
    TITLES: ["Mr.", "Ms.", null] as const,
    GEMSTONE_COLORS: [
        "red", "blue", "green", "yellow", "purple",
        "pink", "orange", "white", "black"
    ] as const,
    ORDER_STATES: ["inCart", "ordered", "delivered"] as const,
    SETTING_SIZES: ["small", "medium", "big", "one-size"] as const,
    SETTING_TYPE: ["prong", "bezel", "cluster", "halo", "pave", "channel", "tension"] as const
} as const;

export default ENUMS;