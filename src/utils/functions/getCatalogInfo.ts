import axios from 'axios';

export interface CatalogResponse {
    status: number;
    data: Data;
}

export interface Data {
    hash: string;
    date: string;
    vbuckIcon: string;
    featured: Storefront;
    daily: Storefront;
    specialFeatured: Storefront;
    specialDaily: Storefront;
    votes: null;
    voteWinners: null;
}

export interface Entry {
    regularPrice: number;
    finalPrice: number;
    bundle?: Bundle;
    banner: Banner;
    giftable: boolean;
    refundable: boolean;
    sortPriority: number;
    categories: string[];
    sectionId: string;
    section: Section;
    devName: string;
    offerId: string;
    displayAssetPath: string;
    tileSize: TileSize;
    newDisplayAssetPath: string;
    newDisplayAsset: NewDisplayAsset;
    items: Item[];
}

export interface Bundle {
    name: string;
    info: string;
    image: string;
}

export interface Storefront {
    name: string;
    entries: Entry[];
}

export interface ItemImages {
    smallIcon: string;
    icon: string;
    featured: null | string;
    other: Other | null;
}

export interface Other {
    background?: string;
    coverart?: string;
}

export interface Introduction {
    chapter: string;
    season: string;
    text: string;
    backendValue: number;
}

export interface Rarity {
    value: RarityValue;
    displayValue: RarityDisplayValue;
    backendValue: RarityBackendValue;
}

export enum RarityBackendValue {
    AthenaBackpack = 'AthenaBackpack',
    AthenaCharacter = 'AthenaCharacter',
    AthenaDance = 'AthenaDance',
    AthenaGlider = 'AthenaGlider',
    AthenaItemWrap = 'AthenaItemWrap',
    AthenaLoadingScreen = 'AthenaLoadingScreen',
    AthenaMusicPack = 'AthenaMusicPack',
    AthenaPickaxe = 'AthenaPickaxe',
    EFortRarityEpic = 'EFortRarity::Epic',
    EFortRarityLegendary = 'EFortRarity::Legendary',
    EFortRarityRare = 'EFortRarity::Rare',
    EFortRarityUncommon = 'EFortRarity::Uncommon'
}

export enum RarityDisplayValue {
    BackBling = 'Back Bling',
    Emote = 'Emote',
    Epic = 'Epic',
    Glider = 'Glider',
    HarvestingTool = 'Harvesting Tool',
    IconSeries = 'Icon Series',
    Legendary = 'Legendary',
    LoadingScreen = 'Loading Screen',
    MarvelSeries = 'MARVEL SERIES',
    Music = 'Music',
    Outfit = 'Outfit',
    Rare = 'Rare',
    SlurpSeries = 'Slurp Series',
    Uncommon = 'Uncommon',
    Wrap = 'Wrap'
}

export enum RarityValue {
    Backpack = 'backpack',
    Emote = 'emote',
    Epic = 'epic',
    Glider = 'glider',
    Icon = 'icon',
    Legendary = 'legendary',
    Loadingscreen = 'loadingscreen',
    Marvel = 'marvel',
    Music = 'music',
    Outfit = 'outfit',
    Pickaxe = 'pickaxe',
    Rare = 'rare',
    Slurp = 'slurp',
    Uncommon = 'uncommon',
    Wrap = 'wrap'
}

export interface Series {
    value: RarityDisplayValue;
    image: null | string;
    colors: string[];
    backendValue: SeriesBackendValue;
}

export enum SeriesBackendValue {
    CreatorCollabSeries = 'CreatorCollabSeries',
    MarvelSeries = 'MarvelSeries',
    SlurpSeries = 'SlurpSeries'
}

export interface Set {
    value: string;
    text: string;
    backendValue: string;
}

export interface Variant {
    channel: Channel;
    type: string;
    options: Option[];
}

export enum Channel {
    ClothingColor = 'ClothingColor',
    Emissive = 'Emissive',
    Material = 'Material',
    Mesh = 'Mesh',
    Particle = 'Particle',
    Parts = 'Parts',
    Progressive = 'Progressive'
}

export interface Option {
    tag: string;
    name: string;
    image: string;
}

export interface MaterialInstance {
    id: string;
    images: Images;
    colors: Colors;
    scalings: { [key: string]: number };
    flags: null;
}

export interface Colors {
    Background_Color_A: string;
    Background_Color_B: string;
    FallOff_Color: string;
    MF_RadialCoordinates?: string;
}

export interface Images {
    OfferImage: string;
    Background: string;
}

export interface Section {
    id: string;
    name: string;
    index: number;
    landingPriority: number;
    sortOffersByOwnership: boolean;
    showIneligibleOffers: boolean;
    showIneligibleOffersIfGiftable: boolean;
    showTimer: boolean;
    enableToastNotification: boolean;
    hidden: boolean;
}

export interface Banner {
    value: string;
    intensity: Intensity;
    backendValue: string;
}

export enum Intensity {
    High = 'High',
    Low = 'Low'
}

export interface Bundle {
    name: string;
    info: string;
    image: string;
}

export enum Category {
    Panel01 = 'Panel 01',
    Panel02 = 'Panel 02',
    Panel03 = 'Panel 03',
    Panel04 = 'Panel 04'
}

export interface NewDisplayAsset {
    id: string;
    cosmeticId: string | null;
    materialInstances: MaterialInstance[];
}

export interface MaterialInstance {
    id: string;
    images: Images;
    colors: Colors;
    scalings: { [key: string]: number };
    flags: null;
}

export interface Colors {
    Background_Color_A: string;
    Background_Color_B: string;
    FallOff_Color: string;
    MF_RadialCoordinates?: string;
    RGB1?: string;
    TextilePanSpeed?: string;
    TextilePerspective?: string;
    TextileScale?: string;
}

export interface Images {
    OfferImage: string;
    Background: string;
    FNMTexture?: string;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: Rarity;
    rarity: Rarity;
    series: Series | null;
    set: Set | null;
    introduction: Introduction;
    images: ItemImages;
    variants: Variant[] | null;
    searchTags: string[] | null;
    gameplayTags: string[];
    metaTags: string[] | null;
    showcaseVideo: null | string;
    dynamicPakId: null | string;
    displayAssetPath: null | string;
    definitionPath: null | string;
    path: string;
    added: string;
    shopHistory: string[];
    itemPreviewHeroPath?: string;
    builtInEmoteIds?: string[];
}

export enum TileSize {
    DoubleWide = 'DoubleWide',
    Normal = 'Normal',
    Small = 'Small'
}

const getCatalogInfo = async () => {
    const { data } = await axios.get<CatalogResponse>('https://fortnite-api.com/v2/shop/br');
    return data.data;
};

export default getCatalogInfo;
