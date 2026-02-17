import type { Tour, Concert } from '../types/schema'

export interface SetlistItem {
  seq: number
  name: string
  is_added?: boolean
  is_encore?: boolean
  encore_level?: number // 第幾安 (1, 2, 3...)
  is_medley?: boolean
  is_cover?: boolean
  is_request?: boolean
  note?: string
}

/**
 * 根據巡迴標準歌單與場次變動，計算該場次的完整歌單
 */
export function getConcertSetlist(tour: Tour, concert: Concert): SetlistItem[] {
  // 1. 複製標準歌單 (Main Set)
  let mainSet: SetlistItem[] = tour.standard_main_set.map((song, index) => ({
    seq: song.seq || index + 1,
    name: song.name,
    is_medley: song.is_medley,
    is_cover: song.is_cover,
    is_request: song.is_request,
    note: song.note,
  }))

  // 2. 移除指定序號的歌曲
  if (concert.main_set_modifications?.removed_seq) {
    mainSet = mainSet.filter(
      (song) => !concert.main_set_modifications!.removed_seq!.includes(song.seq)
    )
  }

  // 3. 插入新增的歌曲
  if (concert.main_set_modifications?.added) {
    concert.main_set_modifications.added.forEach((addedGroup) => {
      const insertIndex = mainSet.findIndex((song) => song.seq === addedGroup.after_seq)
      
      if (insertIndex !== -1) {
        // 將所有新增歌曲插入到指定序號後
        const newSongs: SetlistItem[] = addedGroup.songs.map((song, i) => ({
          seq: addedGroup.after_seq + 0.1 + i * 0.01, // 使用小數避免序號衝突
          name: song.name,
          is_added: true,
          is_medley: song.is_medley,
          is_cover: song.is_cover,
          is_request: song.is_request,
          note: song.note,
        }))
        
        mainSet.splice(insertIndex + 1, 0, ...newSongs)
      }
    })
  }

  // 4. 加入安可曲 (Encores)
  const encoreSongs: SetlistItem[] = []
  if (concert.encores && concert.encores.length > 0) {
    concert.encores.forEach((encoreLevel) => {
      encoreLevel.songs.forEach((song, index) => {
        encoreSongs.push({
          seq: 1000 + encoreLevel.level * 10 + index, // 使用大序號表示安可
          name: song.name,
          is_encore: true,
          encore_level: encoreLevel.level,
          is_medley: song.is_medley,
          is_cover: song.is_cover,
          is_request: song.is_request,
          note: song.note,
        })
      })
    })
  }

  return [...mainSet, ...encoreSongs]
}
