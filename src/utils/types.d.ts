type RealEstate = {
	id: number;
	taxDeclaration: TaxDeclaration;
	address: string;
	road_number: number;
	area_code: number;
	area_size: number;
	description: string;
};

type User = {
	id: number;
	username: string;
	firstname: string | null;
	lastname: string | null;
	email: string;
	password: string;
	roles: Role[];
	realEstateList: RealEstate[];
	sellerTaxDeclarationList: TaxDeclaration[];
	sellerNotaryList: TaxDeclaration[];
	buyerTaxDeclarationList: TaxDeclaration[];
	buyerNotaryList: TaxDeclaration[];
};

type TaxDeclaration = {
	id: number;
	declaration_content: string | null;
	accepted: number;
	completed: boolean;
	seller_id: number;
	buyer_id: number;
	notary_buyer_id: number;
	notary_seller_id: number;
	payment_id: number;
};

type Role = {
	role_id: number;
	name: 'ROLE_USER' | 'ROLE_ADMIN';
};

type TaxRole = 'Seller' | 'Buyer' | "Seller's Notary" | "Buyer's Notary";
