create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','seller','admin');
create type public.order_status as enum ('PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar text,
  bio text default '',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text default '',
  cover_image text not null,
  published boolean not null default true,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  mrp numeric(12,2),
  description text default '',
  category text not null default 'Fashion',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  sku text,
  material text,
  care text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'PLACED',
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  payment_method text not null default 'COD',
  payment_id text,
  address jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete set null,
  product_name text not null,
  price numeric(12,2) not null,
  size text,
  color text,
  quantity integer not null check (quantity > 0),
  image text
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text default '',
  created_at timestamptz not null default now(),
  unique(product_id, user_id)
);

create index if not exists products_seller_idx on public.products(seller_id);
create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists orders_user_idx on public.orders(user_id);

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "profile own update" on public.profiles for update using (auth.uid() = id);
create policy "profile own insert" on public.profiles for insert with check (auth.uid() = id);

create policy "published collections public read" on public.collections for select using (published = true or auth.uid() = seller_id);
create policy "seller create collection" on public.collections for insert with check (auth.uid() = seller_id);
create policy "seller update collection" on public.collections for update using (auth.uid() = seller_id);
create policy "seller delete collection" on public.collections for delete using (auth.uid() = seller_id);

create policy "published products public read" on public.products for select using (published = true or auth.uid() = seller_id);
create policy "seller create product" on public.products for insert with check (auth.uid() = seller_id);
create policy "seller update product" on public.products for update using (auth.uid() = seller_id);
create policy "seller delete product" on public.products for delete using (auth.uid() = seller_id);

create policy "own wishlist read" on public.wishlists for select using (auth.uid() = user_id);
create policy "own wishlist write" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own orders read" on public.orders for select using (auth.uid() = user_id);
create policy "own orders create" on public.orders for insert with check (auth.uid() = user_id);
create policy "own order items read" on public.order_items for select using (exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "public reviews read" on public.reviews for select using (true);
create policy "own review write" on public.reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,name,email,avatar)
  values(new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email, new.raw_user_meta_data->>'avatar_url')
  on conflict(id) do update set email=excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Storage bucket for seller/product images. Create this in Storage if your project disallows SQL bucket creation.
insert into storage.buckets (id,name,public) values ('rd-fashion','rd-fashion',true) on conflict (id) do nothing;
create policy "public read rd images" on storage.objects for select using (bucket_id = 'rd-fashion');
create policy "authenticated upload rd images" on storage.objects for insert to authenticated with check (bucket_id = 'rd-fashion');
create policy "owner update rd images" on storage.objects for update to authenticated using (bucket_id = 'rd-fashion' and owner = auth.uid());
create policy "owner delete rd images" on storage.objects for delete to authenticated using (bucket_id = 'rd-fashion' and owner = auth.uid());
