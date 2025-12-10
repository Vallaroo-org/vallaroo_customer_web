'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Address {
    id: string;
    name: string; // Label e.g. Home, Work
    recipient_name?: string;
    phone_number?: string;
    house_no?: string;
    road_name?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    is_default?: boolean;
}

interface AddressCardProps {
    address: Address;
    onEdit?: (address: Address) => void;
    onDelete?: (id: string) => void;
    onSelect?: (address: Address) => void;
    selected?: boolean;
}

export default function AddressCard({ address, onEdit, onDelete, onSelect, selected }: AddressCardProps) {
    const { t } = useLanguage();

    const fullAddress = [
        address.house_no,
        address.road_name,
        address.landmark,
        address.city,
        address.state,
        address.pincode ? `Pin: ${address.pincode}` : null
    ].filter(Boolean).join(', ');

    return (
        <div
            className={`border rounded-xl p-4 transition-all ${selected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
                } cursor-pointer`}
            onClick={() => onSelect && onSelect(address)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-card-foreground">{address.recipient_name || address.name}</span>
                        {address.recipient_name && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full italic">
                                {address.name}
                            </span>
                        )}
                        {address.is_default && (
                            <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold shadow-md shadow-primary/20">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{fullAddress}</p>
                    {address.phone_number && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('phone')}: {address.phone_number}
                        </p>
                    )}
                </div>
            </div>

            {(onEdit || onDelete) && (
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                            className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
                            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
