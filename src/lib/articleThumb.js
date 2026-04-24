const ARTICLE_IMAGES = {
  // What Is Tax and Why Do We Pay It?
  '60df8513-71c6-4dc0-8b5f-c15b75900e25': 'https://loremflickr.com/600/400/tax,invoice,receipt?lock=5001',
  // Understanding the State Budget: Where Does the Money Come From?
  'd86c15ea-a822-40ec-8ada-c22a1065f5f8': 'https://loremflickr.com/600/400/government,minister,meeting?lock=6002',
  // Income Tax Rates: Who Pays How Much?
  'e7b6243d-3ca7-43c1-9e2a-0b8599fc141c': 'https://loremflickr.com/600/400/money,calculator,finance?lock=3003',
  // Fiscal Transparency: Your Right to Know
  '171a7538-2ca2-4dae-9f1c-951c3df3a753': 'https://loremflickr.com/600/400/open,government,transparency?lock=7002',
  // Tax and Development: Where Does Your Money Go?
  '584f15cb-6cf6-487e-9696-e17f5913faba': 'https://loremflickr.com/600/400/infrastructure,road,bridge?lock=1005',
  // Tax Ratio: Indonesia Still Lags Behind Neighboring Countries
  '34f24d15-fcb7-4871-b445-bf2e70e12b5f': 'https://loremflickr.com/600/400/economy,chart,statistics?lock=1006',
  // How to File Your Annual Tax Return (SPT)
  'db2b13fb-89f5-4d5f-b638-c1bbf4ed502e': 'https://loremflickr.com/600/400/laptop,form,document?lock=1007',
  // Tax Corruption: Understanding and Preventing It
  '8427dfd9-d179-4925-98a1-5fe020e7cdc8': 'https://loremflickr.com/600/400/money,corruption,bribe?lock=4013',
  // Tax for Gen Z: Why It Actually Matters to You
  '3e2ccccf-704c-4366-9984-4b74aefa05ef': 'https://loremflickr.com/600/400/youth,young,technology?lock=1009',
  // Fiscal Decentralization: Regional Taxes and Their Benefits
  'b4d03c26-294e-4bf0-801a-7886dfc6f407': 'https://loremflickr.com/600/400/city,urban,municipality?lock=1010',
}

export function getArticleThumbUrl(id, category) {
  return ARTICLE_IMAGES[id] ?? `https://picsum.photos/seed/${category}-${id}/600/400`
}
