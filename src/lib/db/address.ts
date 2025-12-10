import { supabase } from '../supabaseClient';
import { Address, NewAddress } from '../../types/address';

export async function getUserAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data || [];
}

export async function addUserAddress(userId: string, address: NewAddress): Promise<Address> {
    // If setting as default, unset other defaults first
    if (address.is_default) {
        await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', userId);
    }

    const { data, error } = await supabase
        .from('user_addresses')
        .insert({
            ...address,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteAddress(id: string): Promise<void> {
    const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
}
