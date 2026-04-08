import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"
import fr from "i18n-iso-countries/langs/fr.json"

countries.registerLocale(en)
countries.registerLocale(fr)

export type CountryOption = {
  code: string
  label: string
  flag: string
}

function getFlagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (character) =>
      String.fromCodePoint(127397 + character.charCodeAt(0))
    )
}

export function getCountryOptions(locale: "fr" | "en"): CountryOption[] {
  const countryNames = countries.getNames(locale, { select: "official" })

  return Object.entries(countryNames)
    .map(([code, label]) => ({
      code,
      label,
      flag: getFlagEmoji(code),
    }))
    .sort((leftCountry, rightCountry) =>
      leftCountry.label.localeCompare(rightCountry.label, locale)
    )
}
