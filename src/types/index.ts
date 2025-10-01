/**
 * 通用类型定义
 */

// 新闻相关类型
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    summary?: string;
    author?: string;
    publishDate: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
}

// 产品相关类型
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    stock?: number;
    isAvailable?: boolean;
}

// 传承人相关类型
export interface Inheritor {
    id: number;
    name: string;
    title: string;
    description: string;
    imageUrl?: string;
    specialty?: string;
    experience?: string;
    achievements?: string[];
}

// 预约相关类型
export interface ReservationForm {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    service: string;
    message?: string;
}

// 图片相关类型
export interface ImageItem {
    id: number;
    url: string;
    title?: string;
    description?: string;
    category?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// 分页类型
export interface PaginationParams {
    page: number;
    pageSize: number;
    total?: number;
}

// 路由参数类型
export interface RouteParams {
    id?: string;
    [key: string]: string | undefined;
}