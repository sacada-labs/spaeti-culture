import { useQuery } from '@tanstack/react-query'
import { fetchSpaetis } from '../data/spaetiData'

export const useSpaetis = () => {
    return useQuery({
        queryKey: ['spaetis'],
        queryFn: fetchSpaetis,
    })
}
