import { Suspense } from 'react'
import { SearchResults } from '@/components/search/search-results'

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ผลการค้นหา</h1>
      <Suspense fallback={<div className="text-center py-8">กำลังโหลด...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}