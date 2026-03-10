import { StudioView } from "./StudioView";

export default async function StudioPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <StudioView id={id} />;
}
