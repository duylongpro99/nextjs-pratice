interface ShopePageProps {
    content: React.ReactNode;
    menu: React.ReactNode;
    children: React.ReactNode;
}
export default function ShopLayout({ children, content, menu }: ShopePageProps) {
    return (
        <>
            <div>{menu}</div>
            <div>{content}</div>
            <div>{children}</div>
        </>
    );
}
