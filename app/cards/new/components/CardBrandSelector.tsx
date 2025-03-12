import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardBrand } from "@/services/Card"

type Props = {
    setCardType: (cardType: string) => void,
    brands: CardBrand[]
}

export const CardBrandSelector = ({ setCardType, brands }: Props) => {

    return <div className="grid gap-3">
        <Label htmlFor="type">Card Type</Label>
        <Select onValueChange={setCardType} required>
            <SelectTrigger id="type">
                <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
                {
                    brands.map((brand) => <SelectItem key={`brand-${brand.id}`}
                        value={String(brand.id)}>{brand.name}
                    </SelectItem>)
                }
            </SelectContent>
        </Select>
    </div>
}