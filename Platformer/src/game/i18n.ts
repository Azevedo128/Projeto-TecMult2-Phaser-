import { Scene } from 'phaser';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';

export type LanguageId = 'pt' | 'en' | 'es' | 'de' | 'zh';

type Dictionary = typeof pt;
type Replacements = Record<string, string | number>;

export type LanguageOption = {
    id: LanguageId;
    flagKey: string;
};

export const DEFAULT_LANGUAGE: LanguageId = 'pt';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    { id: 'pt', flagKey: 'flag-pt' },
    { id: 'en', flagKey: 'flag-en' },
    { id: 'es', flagKey: 'flag-es' },
    { id: 'de', flagKey: 'flag-de' },
    { id: 'zh', flagKey: 'flag-cn' }
];

const dictionaries: Record<LanguageId, Dictionary> = {pt,en,es,de,zh};

const legacyLanguageIds: Record<string, LanguageId> = {
    Portugues: 'pt',
    Ingles: 'en',
    Espanhol: 'es',
    Alemao: 'de',
    Chines: 'zh'
};

const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

export function getCurrentLanguage(scene: Scene): LanguageId
{
    const storedLanguage = scene.registry.get('selectedLanguage');

    if (typeof storedLanguage === 'string')
    {
        if (isLanguageId(storedLanguage))
        {
            return storedLanguage;
        }

        const migratedLanguage = legacyLanguageIds[storedLanguage];

        if (migratedLanguage)
        {
            scene.registry.set('selectedLanguage', migratedLanguage);
            saveLanguage(migratedLanguage);

            return migratedLanguage;
        }
    }

    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage && isLanguageId(savedLanguage))
    {
        scene.registry.set('selectedLanguage', savedLanguage);
        return savedLanguage;
    }

    return DEFAULT_LANGUAGE;
}

export function setCurrentLanguage(scene: Scene, language: LanguageId)
{
    scene.registry.set('selectedLanguage', language);
    saveLanguage(language);
}

export function getLanguageName(scene: Scene, language: LanguageId)
{
    return translate(scene, `languageNames.${language}`);
}

export function translate(scene: Scene, key: string, replacements: Replacements = {})
{
    const language = getCurrentLanguage(scene);
    const text = getDictionaryText(dictionaries[language], key) ?? getDictionaryText(dictionaries[DEFAULT_LANGUAGE], key) ?? key;

    return interpolate(text, replacements);
}

function isLanguageId(value: string): value is LanguageId
{
    return value in dictionaries;
}

function saveLanguage(language: LanguageId)
{
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

function getDictionaryText(dictionary: Dictionary, key: string)
{
    let value: unknown = dictionary;

    for (const part of key.split('.'))
    {
        if (!isObject(value) || !(part in value))
        {
            return undefined;
        }

        value = value[part];
    }

    return typeof value === 'string' ? value : undefined;
}

function interpolate(text: string, replacements: Replacements)
{
    return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
        const value = replacements[key];

        return value === undefined ? match : String(value);
    });
}

function isObject(value: unknown): value is Record<string, unknown>
{
    return typeof value === 'object' && value !== null;
}
